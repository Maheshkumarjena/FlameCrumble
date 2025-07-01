'use client';
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import WishlistItem from '@/components/Wishlist/WishlistItem';
import axios from 'axios';
import { FiHeart, FiShoppingCart, FiArrowRight } from 'react-icons/fi';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [operationError, setOperationError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const router = useRouter();

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const response = await axios.get(`${BACKEND_URL}/api/wishlist`, {
        withCredentials: true,
      });
      setWishlistItems(response.data.items);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFetchError(err.response?.data?.error || 'Failed to load wishlist');
      } else {
        setFetchError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const checkAuthAndFetchWishlist = async () => {
      setLoading(true);
      setFetchError('');

      try {
        const authResponse = await axios.get(`${BACKEND_URL}/api/auth/status`, {
          withCredentials: true,
          signal: signal,
        });
        setIsAuthenticated(true);
        await fetchWishlist();
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            setIsAuthenticated(false);
            setWishlistItems([]);
            setLoading(false);
          } else if (!signal.aborted) {
            setFetchError(err.response?.data?.error || 'Failed to check authentication status or fetch wishlist.');
            setIsAuthenticated(false);
            setLoading(false);
          }
        } else if (!signal.aborted) {
          setFetchError('Network error. Please try again.');
          setIsAuthenticated(false);
          setLoading(false);
        }
      } finally {
        setInitialAuthCheckDone(true);
      }
    };

    checkAuthAndFetchWishlist();

    return () => controller.abort();
  }, [fetchWishlist]);

  const removeItem = async (productId) => {
    setOperationError('');
    try {
      await axios.delete(`${BACKEND_URL}/api/wishlist/${productId}`, {
        withCredentials: true,
      });
      setWishlistItems(prev => prev.filter(item => item.product._id !== productId));
    } catch (err) {
      setOperationError(
        axios.isAxiosError(err)
          ? err.response?.data?.error || 'Failed to remove item'
          : 'Network error'
      );
    }
  };

  const moveToCart = async (product) => {
    setOperationError('');
    try {
      await axios.post(`${BACKEND_URL}/api/cart`, {
        productId: product._id,
        quantity: 1
      }, {
        withCredentials: true,
      });
      setWishlistItems(prev => prev.filter(item => item.product._id !== product._id));
    } catch (err) {
      setOperationError(
        axios.isAxiosError(err)
          ? err.response?.data?.error || 'Failed to move to cart'
          : 'Network error'
      );
    }
  };

  if (!initialAuthCheckDone || (loading && isAuthenticated)) {
    return (
      <main className="min-h-screen flex justify-center items-center bg-[#FFF5F7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30B5D]"></div>
      </main>
    );
  }

  if (initialAuthCheckDone && !isAuthenticated) {
    return (
      <>
        <Head>
          <title>My Wishlist | flame&crumble</title>
          <meta name="description" content="Your saved items" />
        </Head>

        <Navbar />

        <main className="min-h-screen bg-[#FFF5F7] py-16 px-4 flex flex-row justify-center items-center sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="bg-[#E30B5D]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="text-[#E30B5D]" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Wishlist Awaits</h2>
            <p className="text-gray-600 mb-6">
              Sign in to view your saved items and access them across all your devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/auth/login?returnUrl=${encodeURIComponent('/wishlist')}`}
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

  return (
    <>
      <Head>
        <title>My Wishlist | flame&crumble</title>
        <meta name="description" content="Your saved items" />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-[#FFF5F7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600 flex items-center">
              <FiHeart className="mr-2 text-[#E30B5D]" />
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {fetchError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{fetchError}</p>
            </div>
          )}

          {operationError && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{operationError}</p>
            </div>
          )}

          {wishlistItems.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center max-w-md mx-auto">
              <div className="bg-[#E30B5D]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="text-[#E30B5D]" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Wishlist is Empty</h3>
              <p className="text-gray-600 mb-6">
                Save your favorite items to view them later and shop across devices.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center bg-[#E30B5D] hover:bg-[#C90A53] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                Browse Products
                <FiArrowRight className="ml-2" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map(wishlistItem => (
                <WishlistItem
                  key={wishlistItem.product._id}
                  item={{
                    id: wishlistItem.product._id,
                    name: wishlistItem.product.name,
                    price: wishlistItem.product.price,
                    image: wishlistItem.product.image,
                    stock: wishlistItem.product.stock > 0,
                  }}
                  onMoveToCart={() => moveToCart(wishlistItem.product)}
                  onRemove={() => removeItem(wishlistItem.product._id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}