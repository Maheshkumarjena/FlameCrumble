'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems, selectWishlistLoading, selectIsAuthenticated } from '@/lib/features/auth/selector';
import { addToCart } from '@/lib/features/auth/cartSlice';
import { toggleWishlistItem } from '@/lib/features/auth/wishlistSlice';
import { toast } from 'sonner'; // Ensure you have sonner installed for notifications

const ProductCard = ({ product }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const wishlistItems = useSelector(selectWishlistItems);
  const loadingWishlist = useSelector(selectWishlistLoading);


  // console.log('Wishlist Items:', wishlistItems); // Debugging line to check wishlist items
  const isInWishlist = wishlistItems.some(item => item.product?._id == product.id);

  const handleHeartClick = async () => {
    if (!isAuthenticated) {
      toast('Please log in to add items to your wishlist!');
      return;
    }

    // Always trigger the animation before dispatching the action
    setIsAnimating(true);

    const resultAction = await dispatch(toggleWishlistItem(product.id));

    // Reset the animation after a short delay, regardless of success or failure
    // This allows the animation to play even if the API call is fast
    setTimeout(() => setIsAnimating(false), 300); // Match this duration to your animation duration

    if (toggleWishlistItem.fulfilled.match(resultAction)) {
      // Determine if it was added or removed for the toast message
      const wasAdded = resultAction.payload.action === 'added'; // Assuming your payload includes an 'action' field
      toast(`${product.name} ${wasAdded ? 'added to' : 'removed from'} Wishlist!`);
    } else {
      console.error('Failed to toggle wishlist:', resultAction.payload);
      toast(resultAction.payload || 'Failed to update wishlist.');
    }
  };

  const handleAddToCartClick = async () => {
    if (!isAuthenticated) {
      toast('Please log in to add items to your cart!');
      return;
    }

    const resultAction = await dispatch(addToCart({ productId: product.id, quantity: 1 }));

    if (addToCart.fulfilled.match(resultAction)) {
      toast(`${product.name} added to cart!`);
    } else {
      console.error('Failed to add to cart:', resultAction.payload);
      toast(resultAction.payload || 'Failed to add item to cart.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
        {product.bestseller && (
          <span className="absolute top-2 left-2 bg-[#E30B5D] text-white text-xs px-2 py-1 rounded-md">
            Bestseller
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
            New
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 h-10 overflow-hidden">{product.description}</p>
        <p className="text-[#E30B5D] font-bold mb-3">₹{product.price ? product.price.toFixed(2) : 'N/A'}</p>

       <div className="flex justify-between items-center">
          <button
            onClick={handleAddToCartClick}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              product.stock 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-300/30 hover:scale-105' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!product.stock}
          >
            <div className="flex items-center">
              <FiShoppingCart className="mr-2" size={16} />
              {product.stock ? 'Add to Cart' : 'Out of Stock'}
            </div>
          </button>
          <button
            onClick={handleHeartClick}
            className={`
              p-2 rounded-full transition-all duration-300 hover:bg-rose-50
              ${isAnimating ? 'animate-heart-pop' : ''}
            `}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            disabled={loadingWishlist}
          >
            <FiHeart 
              size={20} 
              className={isInWishlist ? 'text-rose-500 fill-rose-500' : 'text-gray-400 hover:text-rose-500'} 
            />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes heart-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-heart-pop {
          animation: heart-pop 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;