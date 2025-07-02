// components/OrderConfirmationContent.js
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import {
  FaCheckCircle,
  FaShoppingBag,
  FaHome,
  FaEnvelope,
  FaTruck,
  FaCreditCard,
  FaCalendarAlt
} from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import Link from "next/link"; // Make sure Link is imported here if used within this component

export default function OrderConfirmationContent() { // Renamed component
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const DELIVERY_CHARGE = 250; // Constant delivery charge

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/orders/${orderId}`, {
            withCredentials: true,
          });
          console.log("Order data:", response.data);
          setOrder(response.data);
        } catch (err) {
          console.error("Error fetching order:", err);
          setError(err.response?.data?.error || "Failed to load order details");
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    } else {
      setError("No order ID provided");
      setLoading(false);
    }
  }, [orderId]);

  const subtotal = order?.items?.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30B5D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            href="/shop"
            className="inline-block bg-gradient-to-r from-[#E30B5D] to-[#ff6b8b] hover:from-[#c5094f] hover:to-[#e0557e] text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md transform hover:scale-105"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Success Header with gradient */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full">
              <FaCheckCircle className="text-white text-5xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Order Confirmed!
          </h1>
          <p className="text-white/90">
            Thank you for your purchase. We've received your order and it's being processed.
          </p>
          <div className="mt-4 bg-white/10 inline-block px-4 py-2 rounded-full">
            <span className="font-semibold">Order ID: {order?._id}</span>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#E30B5D] rounded-full flex items-center justify-center text-white mb-2">
                <FiPackage />
              </div>
              <span className="text-sm font-medium">Order Placed</span>
            </div>
            <div className="h-1 flex-1 bg-gray-200 mx-2 relative">
              <div className="absolute top-0 left-0 h-full bg-[#E30B5D] w-1/3"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-2">
                <FaTruck />
              </div>
              <span className="text-sm text-gray-500">Shipped</span>
            </div>
            <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-2">
                <FaCheckCircle />
              </div>
              <span className="text-sm text-gray-500">Delivered</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Shipping Information */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaTruck className="text-[#E30B5D] mr-2" />
              Shipping Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Recipient</p>
                <p className="font-medium">{order?.shippingAddress?.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">
                  {order?.shippingAddress?.line1}
                  {order?.shippingAddress?.line2 && (
                    <>, {order.shippingAddress.line2}</>
                  )}<br />
                  {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.zip}<br />
                  {order?.shippingAddress?.country}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{order?.shippingAddress?.phone}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCreditCard className="text-[#E30B5D] mr-2" />
              Order Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium flex items-center">
                  <FaCalendarAlt className="mr-2 text-sm" />
                  {new Date(order?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium capitalize">{order?.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-medium capitalize bg-[#E30B5D]/10 text-[#E30B5D] px-3 py-1 rounded-full text-sm">
                  {order?.status}
                </span>
              </div>
              {order?.razorpayOrderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-medium text-sm">{order.razorpayOrderId}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-8 border-t border-b border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Your Order</h2>
          <div className="space-y-6">
            {order?.items?.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML = (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FaShoppingBag className="text-2xl" />
                            </div>
                          );
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaShoppingBag className="text-2xl" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.product?.name || "Product"}
                    </h3>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-gray-500 text-sm">₹{item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Totals */}
        <div className="p-8">
          <div className="max-w-md ml-auto space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₹{DELIVERY_CHARGE.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-[#E30B5D]">₹{(subtotal + DELIVERY_CHARGE).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 p-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-[#E30B5D] to-[#ff6b8b] hover:from-[#c5094f] hover:to-[#e0557e] transition-all transform hover:scale-105"
          >
            <FaShoppingBag className="mr-2" />
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-all"
          >
            <FaHome className="mr-2" />
            View All Orders
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-all"
          >
            <FaEnvelope className="mr-2" />
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}