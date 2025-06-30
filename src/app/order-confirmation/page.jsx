"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import axios from "axios";
import { FaCheckCircle, FaShoppingBag, FaHome, FaEnvelope } from "react-icons/fa";

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/orders/${orderId}`, {
            withCredentials: true,
          });
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30B5D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <Link
              href="/shop"
              className="inline-block bg-[#E30B5D] hover:bg-[#c5094f] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              Back to Shop
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
        <title>Order Confirmation | flame&crumble</title>
        <meta name="description" content="Your order confirmation" />
      </Head>

      <Navbar />

      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-100 p-8 text-center">
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-green-600 text-5xl" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-green-600">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <p className="text-gray-700 mt-2">
              Order ID: <span className="font-semibold">{order?._id}</span>
            </p>
          </div>

          {/* Order Summary */}
          <div className="p-8 border-b">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                <address className="not-italic text-gray-600">
                  {order?.shippingAddress?.fullName}<br />
                  {order?.shippingAddress?.line1}<br />
                  {order?.shippingAddress?.line2 && (
                    <>{order.shippingAddress.line2}<br /></>
                  )}
                  {order?.shippingAddress?.city}, {order?.shippingAddress?.state}<br />
                  {order?.shippingAddress?.zip}<br />
                  {order?.shippingAddress?.country}<br />
                  Phone: {order?.shippingAddress?.phone}
                </address>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Order Date:</span> {new Date(order?.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Payment Method:</span> {order?.paymentMethod}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">{order?.status}</span>
                </p>
                {order?.razorpayOrderId && (
                  <p className="text-gray-600">
                    <span className="font-medium">Transaction ID:</span> {order.razorpayOrderId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-8 border-b">
            <h2 className="text-xl font-semibold mb-4">Your Items</h2>
            <div className="space-y-4">
              {order?.items?.map((item) => (
                <div key={item._id} className="flex justify-between items-start border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                      {/* Replace with actual product image */}
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaShoppingBag className="text-2xl" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.product?.name || "Product"}</h3>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="p-8">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₹{order?.total - order?.deliveryCharge}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">₹{order?.deliveryCharge}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
              <span>Total:</span>
              <span>₹{order?.total}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 p-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#E30B5D] hover:bg-[#c5094f]"
            >
              <FaShoppingBag className="mr-2" />
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-[#E30B5D] bg-white hover:bg-gray-50 border-gray-300"
            >
              <FaHome className="mr-2" />
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
            >
              <FaEnvelope className="mr-2" />
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}