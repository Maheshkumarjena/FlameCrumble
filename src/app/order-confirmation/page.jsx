// app/order-confirmation/page.js
import { Suspense } from 'react';
import Head from "next/head";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import OrderConfirmationContent from "@/components/OrderConfirmationContent"; // Import the renamed component

export default function OrderConfirmationPage() {
  return (
    <>
      <Head>
        <title>Order Confirmation | flame&crumble</title>
        <meta name="description" content="Your order confirmation" />
      </Head>

      <Navbar />

      {/* Wrap the client component in Suspense */}
      <Suspense fallback={
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30B5D]"></div>
        </div>
      }>
        <OrderConfirmationContent />
      </Suspense>

      <Footer />
    </>
  );
}