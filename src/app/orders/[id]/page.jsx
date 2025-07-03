'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { 
  FiChevronLeft, 
  FiClock, 
  FiCheckCircle, 
  FiTruck, 
  FiPackage, 
  FiCreditCard,
  FiMapPin,
  FiHome,
  FiAlertCircle
} from 'react-icons/fi';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function OrderDetails({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const orderId = params.id;

  console.log("order detail at order detail page ==========================>", order)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/orders/${orderId}`, {
          withCredentials: true,
        });
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30B5D] mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <FiAlertCircle className="mx-auto text-4xl text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Order</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/account')}
            className="bg-[#E30B5D] text-white px-6 py-2 rounded-lg hover:bg-[#c5094f] transition-colors"
          >
            Back to Account
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <FiPackage className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <button
            onClick={() => router.push('/account')}
            className="bg-[#E30B5D] text-white px-6 py-2 rounded-lg hover:bg-[#c5094f] transition-colors"
          >
            Back to Account
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (order.status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'processing':
        return <FiClock className="text-blue-500" />;
      case 'shipped':
        return <FiTruck className="text-indigo-500" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Head>
        <title>Order #{order._id} | flame&crumble</title>
        <meta name="description" content="Your order details" />
      </Head>

      <Navbar />

      <main className="min-h-screen  min-w-screen py-16 bg-[#FFF5F7] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => router.push('/account')}
              className="flex items-center text-[#E30B5D] hover:text-[#c5094f] transition-colors"
            >
              <FiChevronLeft className="mr-1" /> Back to My Orders
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-8">
            {/* Order Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Order #{order._id}</h1>
                  <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className={`mt-3 sm:mt-0 px-4 py-2 rounded-full text-sm font-medium flex items-center ${getStatusColor()}`}>
                  {getStatusIcon()}
                  <span className="ml-2 capitalize">{order.status}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="divide-y divide-gray-200">
              <h2 className="px-6 py-4 text-lg font-semibold text-gray-900">Order Items</h2>
              {order.items.map((item, index) => (
                <div key={index} className="p-6 flex flex-col sm:flex-row">
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-0 sm:mr-6">
                    {item.product?.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiPackage className="text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-900">{item.product?.name || 'Product'}</h3>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-gray-500">Price: ₹{item.price.toFixed(2)} each</p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <FiMapPin className="mr-2 text-[#E30B5D]" /> Shipping Address
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="font-medium">{order.shippingAddress?.line1}</p>
                    {order.shippingAddress?.line2 && (
                      <p>{order.shippingAddress.line2}</p>
                    )}
                    <p>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                      {order.shippingAddress?.zip}
                    </p>
                    <p>{order.shippingAddress?.country}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <FiCreditCard className="mr-2 text-[#E30B5D]" /> Payment Method
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="capitalize">{order.paymentMethod}</p>
                    <p className="text-gray-500 mt-1">Paid on {formatDate(order.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{order.total.toFixed(2)-250}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">₹250.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about your order, please contact our customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact">
              <button className="bg-[#E30B5D] text-white px-6 py-2 rounded-lg hover:bg-[#c5094f] transition-colors">
                Contact Support
              </button>
              </Link>
              <Link 
                href="/shop">
              <button 
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                Continue Shopping
              </button>
                </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}