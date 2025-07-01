"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import CartSummary from "@/components/Cart/CartSummary";
import CartItem from "@/components/Cart/CartItem";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/features/auth/cartSlice";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from "@/lib/features/auth/authSlice";
import { checkAuthStatus } from "@/lib/features/auth/authSlice";
import { toast } from "sonner";
import { FiShoppingCart, FiArrowRight } from "react-icons/fi";

export default function Cart() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get state from Redux store
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);
  const cart = useSelector((state) => state.cart.items);
  const loadingCart = useSelector((state) => state.cart.loading);
  const cartErrorObject = useSelector((state) => state.cart.error);
  const authErrorObject = useSelector(selectAuthError);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);

  // Effect to check auth status on component mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Effect to mark initial auth check as done once loading is complete
  useEffect(() => {
    if (!authLoading && !initialAuthCheckDone) {
      setInitialAuthCheckDone(true);
    }
  }, [authLoading, initialAuthCheckDone]);

  // Effect to fetch cart only after auth is confirmed and initialAuthCheckDone is true
  useEffect(() => {
    if (isAuthenticated && initialAuthCheckDone) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, initialAuthCheckDone, dispatch]);

  // Handle quantity update
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    const resultAction = await dispatch(
      updateCartItemQuantity({ itemId, newQuantity })
    );

    if (updateCartItemQuantity.fulfilled.match(resultAction)) {
      toast.success("Cart item quantity updated!");
    } else {
      toast.error(
        resultAction.payload?.message || "Failed to update cart item."
      );
    }
  };

  // Handle item removal
  const handleRemoveItem = async (itemId) => {
    const resultAction = await dispatch(removeCartItem(itemId));

    if (removeCartItem.fulfilled.match(resultAction)) {
      toast.success("Item removed from cart!");
    } else {
      toast.error(
        resultAction.payload?.message || "Failed to remove item from cart."
      );
    }
  };

  // Calculate cart totals
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  // Show loading spinner while checking auth initially
  if (!initialAuthCheckDone && authLoading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </main>
    );
  }

  // Handle unauthenticated state
  if (initialAuthCheckDone && !isAuthenticated) {
    return (
      <>
        <Head>
          <title>Your Cart | flame&crumble</title>
          <meta name="description" content="Your shopping cart" />
        </Head>

        <Navbar />

        <main className="min-h-screen bg-[#FFF5F7] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="bg-[#E30B5D]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingCart className="text-[#E30B5D]" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your Cart Awaits
            </h2>
            <p className="text-gray-600 mb-6">
              Sign in to view your saved items and access them across all your
              devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/auth/login?returnUrl=${encodeURIComponent("/cart")}`}
                className="bg-[#E30B5D] hover:bg-[#C90A53] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="border-2 border-black hover:bg-black hover:text-white text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // If authenticated but cart is still loading and empty, show spinner
  if (isAuthenticated && loadingCart && cart.length === 0) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Your Cart | flame&crumble</title>
        <meta name="description" content="Your shopping cart" />
      </Head>

      <Navbar />

      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl bg-[#FFF5F7] min-w-screen mx-auto">
        <h1 className="text-3xl font-['Playfair_Display'] font-bold mb-8 text-gray-800">
          Your Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Your Cart ({cart.length})
            </h2>

            {cart.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border  border-gray-100 text-center max-w-md mx-auto">
                <div className="bg-[#E30B5D]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiShoppingCart className="text-[#E30B5D]" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Your Cart is Empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Looks like you haven’t added anything to your cart yet.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center bg-[#E30B5D] hover:bg-[#C90A53] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                >
                  Continue Shopping
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((cartItem) => (
                  <CartItem
                    key={cartItem._id}
                    item={{
                      id: cartItem._id,
                      productId: cartItem.product?._id,
                      name: cartItem.product?.name,
                      price: cartItem.product?.price,
                      quantity: cartItem.quantity,
                      image: cartItem.product?.image,
                    }}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="lg:w-1/3">
              <CartSummary
                subtotal={subtotal}
                shipping={shipping}
                total={total}
              />

              <div className="mt-6 space-y-4">
                <Link
                  href="/checkout"
                  className={`block w-full bg-rose-500 hover:bg-rose-600 text-white text-center py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-rose-300/30
                    ${loadingCart ? "opacity-50 cursor-not-allowed" : ""}`}
                  aria-disabled={loadingCart}
                  onClick={(e) => {
                    if (loadingCart) {
                      e.preventDefault();
                      toast.warning(
                        "Please wait for current cart updates to complete before checking out."
                      );
                    }
                  }}
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/shop"
                  className="block w-full bg-transparent hover:bg-rose-50 border-2 border-black text-black text-center py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
