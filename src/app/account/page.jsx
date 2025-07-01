'use client';
import { useState, useEffect, useCallback } from 'react';
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
import { toast } from 'sonner';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);

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
      const isLoggedIn = await checkSessionAuth();
      setIsAuthenticated(isLoggedIn);

      if (isLoggedIn) {
        try {
          await Promise.all([fetchAddresses(), fetchOrders()]);
        } catch (err) {
          toast.error("Failed to load user data. Please try again.");
        }
      }
      setPageLoading(false);
    };

    initializePage();
  }, [checkSessionAuth, fetchAddresses, fetchOrders]);

  if (pageLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-rose-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500" />
        <p className="mt-4 text-gray-700 font-medium">Loading your account...</p>
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

        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md border border-rose-100">
            <h2 className="text-2xl font-['Playfair_Display'] font-bold mb-4 text-gray-800">Login to Access Your Account</h2>
            <p className="text-gray-600 mb-6">
              Please log in to view and manage your account details, orders, and addresses.
            </p>
            <Link
              href={`/auth/login?returnUrl=${encodeURIComponent('/account')}`}
              className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-rose-300/30"
            >
              Go to Login Page
            </Link>
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

      <main className="min-h-screen bg-rose-50 py-10 px-4 sm:px-6 lg:px-8  font-['Poppins']">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center mt-4 lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-['Playfair_Display'] font-bold text-gray-900">My Account</h1>
            <p className="text-lg text-gray-600 mt-2">Welcome back, <span className="font-semibold text-rose-500">{authUser?.name?.split(' ')[0] || 'User'}</span>!</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:w-1/4">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-rose-100">
                <div className="space-y-2">
                  <SidebarButton icon={FiPackage} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                  <SidebarButton icon={FiMapPin} label="Addresses" active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} />
                  <SidebarButton icon={FiUser} label="Account Details" active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
                </div>
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden mb-6 w-full overflow-x-auto">
              <div className="flex bg-white rounded-xl shadow-lg p-2 border border-rose-100">
                <MobileTabButton icon={FiPackage} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                <MobileTabButton icon={FiMapPin} label="Addresses" active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} />
                <MobileTabButton icon={FiUser} label="Account" active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {activeTab === 'orders' && (
                <OrderHistory
                  orders={orders}
                  BACKEND_URL={BACKEND_URL}
                />
              )}

              {activeTab === 'addresses' && (
                <AddressManagement
                  addresses={addresses}
                  fetchAddresses={fetchAddresses}
                  BACKEND_URL={BACKEND_URL}
                />
              )}

              {activeTab === 'account' && (
                <AccountDetailsSection
                  authUser={authUser}
                  dispatch={dispatch}
                  resetAuth={resetAuth}
                  BACKEND_URL={BACKEND_URL}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

const SidebarButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-lg flex items-center font-medium transition-all duration-300
      ${active ? 'bg-rose-500 text-white shadow-md' : 'text-gray-700 hover:bg-rose-50 hover:text-rose-500'}`}
  >
    <Icon className={`mr-3 text-xl ${active ? 'text-white' : 'text-gray-500'}`} />
    <span>{label}</span>
    <FiChevronRight className={`ml-auto text-lg ${active ? 'text-white' : 'text-gray-400'}`} />
  </button>
);

const MobileTabButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 text-center py-2 px-3 flex flex-col items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 mx-1
      ${active ? 'bg-rose-500 text-white shadow' : 'text-gray-600 hover:bg-rose-50 hover:text-rose-500'}`}
  >
    <Icon className={`text-xl mb-1 ${active ? 'text-white' : 'text-gray-500'}`} />
    <span className="whitespace-nowrap">{label}</span>
  </button>
);