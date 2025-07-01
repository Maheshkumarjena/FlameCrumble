'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { FiEdit, FiPlus, FiChevronRight, FiClock, FiCheckCircle, FiTruck, FiShoppingCart, FiUser, FiMapPin, FiPackage, FiX, FiSave, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/lib/features/auth/cartSlice';
import { resetAuth } from '@/lib/features/auth/authSlice';
import axios from 'axios';

import { selectIsAuthenticated, selectAuthUser, selectAuthLoading } from '@/lib/features/auth/selector';
import OrderHistory from '@/components/UserAccount/OrderHistory';
import AddressManagement from '@/components/UserAccount/AddressManagement';
import AccountDetailsSection from '@/components/UserAccount/AccountDetailsSection';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function UserAccount() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeAccountTab') || 'orders';
    }
    return 'orders';
  });
  const [pageLoading, setPageLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log("orders in account page===============>", orders);

  const router = useRouter();
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);

  const [localMessage, setLocalMessage] = useState({ type: '', text: '' });

  const displayLocalMessage = useCallback((type, text) => {
    setLocalMessage({ type, text });
    setTimeout(() => setLocalMessage({ type: '', text: '' }), 3000);
  }, []);

  const checkSessionAuth = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/status`, {
        withCredentials: true,
      });
      return response.data.loggedIn;
    } catch (err) {
      console.error("Session check failed:", err);
      return false;
    }
  }, []);

  const fetchAddresses = useCallback(async () => {
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/addresses`, {
        withCredentials: true,
      });
      setAddresses(response.data.addresses);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      throw err;
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/orders`, {
        withCredentials: true,
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeAccountTab', activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    const initializePage = async () => {
      setPageLoading(true);
      setError(null);

      const isLoggedIn = await checkSessionAuth();
      setIsAuthenticated(isLoggedIn);

      if (isLoggedIn) {
        try {
          await Promise.all([
            fetchAddresses(),
            fetchOrders()
          ]);
        } catch (err) {
          console.error("Error fetching user data after successful auth:", err);
          setError("Failed to load user data. Please try again.");
        }
      }
      setPageLoading(false);
    };

    initializePage();
  }, [checkSessionAuth, fetchAddresses, fetchOrders]);

  if (pageLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30B5D]"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your account...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>My Account | flame&crumble</title>
          <meta name="description" content="Your account dashboard" />
        </Head>

        <Navbar />

        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center bg-pink-300  justify-center">
          <div className="text-center  p-10 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 transform transition-all hover:shadow-2xl">
            <div className="w-20 h-20  rounded-full flex items-center justify-center mx-auto mb-6">
              <FiUser className="text-3xl text-[#E30B5D]" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Welcome Back!</h2>
            <p className="text-gray-600 mb-8">
              Sign in to access your orders, saved addresses, and account details.
            </p>
            <Link
              href={`/auth/login?returnUrl=${encodeURIComponent('/account')}`}
              className="inline-block bg-gradient-to-r from-[#E30B5D] to-[#FF6B9A] hover:from-[#c5094f] hover:to-[#E30B5D] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sign In Now
            </Link>
            <p className="mt-6 text-gray-500 text-sm">
              New customer?{' '}
              <Link href="/auth/register" className="text-[#E30B5D] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>My Account | flame&crumble</title>
        <meta name="description" content="Your account dashboard" />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-[#FFF5F7] to-[#FFF5F7]  py-12 px-4 sm:px-6 lg:px-8 font-inter">
        <div className="max-w-7xl mx-auto">
          {/* User Welcome Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4 lg:mb-0">
              <div className="w-16 h-16 bg-gradient-to-r from-[#E30B5D] to-[#FF6B9A] rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                {authUser?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {authUser?.name?.split(' ')[0] || 'User'}!</h1>
                <p className="text-gray-600">Manage your account and orders</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/shop" 
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-800 flex items-center transition-colors"
              >
                <FiShoppingCart className="mr-2" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Notification Area */}
          <div className="mb-8">
            {localMessage.text && (
              <div className={`p-4 rounded-xl flex items-center justify-between shadow-sm ${localMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center">
                  {localMessage.type === 'success' ? (
                    <FiCheckCircle className="text-green-500 text-xl mr-3" />
                  ) : (
                    <FiX className="text-red-500 text-xl mr-3" />
                  )}
                  <p className={localMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>{localMessage.text}</p>
                </div>
                <button 
                  onClick={() => setLocalMessage({ type: '', text: '' })} 
                  className="text-gray-400 hover:text-gray-600 ml-4"
                >
                  <FiX />
                </button>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center">
                  <FiX className="text-red-500 text-xl mr-3" />
                  <p>{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-gray-400 hover:text-gray-600 ml-4">
                  <FiX />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar - Enhanced */}
            <div className="hidden lg:block lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 border border-gray-100 transition-all hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Account Dashboard</h3>
                <div className="space-y-3">
                  <SidebarButton 
                    icon={FiPackage} 
                    label="My Orders" 
                    active={activeTab === 'orders'} 
                    onClick={() => setActiveTab('orders')} 
                  />
                  <SidebarButton 
                    icon={FiMapPin} 
                    label="Saved Addresses" 
                    active={activeTab === 'addresses'} 
                    onClick={() => setActiveTab('addresses')} 
                  />
                  <SidebarButton 
                    icon={FiUser} 
                    label="Account Details" 
                    active={activeTab === 'account'} 
                    onClick={() => setActiveTab('account')} 
                  />
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  {/* <button 
                    onClick={() => {
                      dispatch(resetAuth());
                      router.push('/');
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg flex items-center font-medium text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                  >
                    <FiX className="mr-3 text-xl text-gray-500" />
                    <span>Sign Out</span>
                  </button> */}
                </div>
              </div>
            </div>

            {/* Mobile Tabs - Enhanced */}
            <div className="lg:hidden mb-6 w-full">
              <div className="flex bg-white rounded-xl shadow-sm p-1 border border-gray-100">
                <MobileTabButton 
                  icon={FiPackage} 
                  label="Orders" 
                  active={activeTab === 'orders'} 
                  onClick={() => setActiveTab('orders')} 
                />
                <MobileTabButton 
                  icon={FiMapPin} 
                  label="Addresses" 
                  active={activeTab === 'addresses'} 
                  onClick={() => setActiveTab('addresses')} 
                />
                <MobileTabButton 
                  icon={FiUser} 
                  label="Account" 
                  active={activeTab === 'account'} 
                  onClick={() => setActiveTab('account')} 
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                {activeTab === 'orders' && (
                  <OrderHistory
                    orders={orders}
                    BACKEND_URL={BACKEND_URL}
                    displayLocalMessage={displayLocalMessage}
                  />
                )}

                {activeTab === 'addresses' && (
                  <AddressManagement
                    addresses={addresses}
                    fetchAddresses={fetchAddresses}
                    BACKEND_URL={BACKEND_URL}
                    displayLocalMessage={displayLocalMessage}
                  />
                )}

                {activeTab === 'account' && (
                  <AccountDetailsSection
                    authUser={authUser}
                    dispatch={dispatch}
                    resetAuth={resetAuth}
                    BACKEND_URL={BACKEND_URL}
                    displayLocalMessage={displayLocalMessage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// Enhanced Sidebar Button Component
const SidebarButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-lg flex items-center font-medium transition-all duration-200 group
      ${active ? 'bg-gradient-to-r from-[#E30B5D] to-[#FF6B9A] text-white shadow-md' : 'text-gray-700 hover:bg-gray-50 hover:text-[#E30B5D]'}`}
  >
    <div className={`p-2 mr-3 rounded-lg ${active ? 'bg-white bg-opacity-20' : 'bg-gray-100 group-hover:bg-pink-50'}`}>
      <Icon className={`text-lg ${active ? 'text-white' : 'text-gray-500 group-hover:text-[#E30B5D]'}`} />
    </div>
    <span>{label}</span>
    <FiChevronRight className={`ml-auto text-lg ${active ? 'text-white opacity-80' : 'text-gray-400'}`} />
  </button>
);

// Enhanced Mobile Tab Button Component
const MobileTabButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 text-center py-3 px-2 flex flex-col items-center justify-center text-sm font-medium rounded-lg transition-all duration-200
      ${active ? 'bg-[#E30B5D] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-[#E30B5D]'}`}
  >
    <div className={`p-1.5 mb-1 rounded-md ${active ? 'bg-white bg-opacity-20' : 'bg-gray-100'}`}>
      <Icon className={`text-xl ${active ? 'text-white' : 'text-gray-500'}`} />
    </div>
    <span className="whitespace-nowrap">{label}</span>
  </button>
);