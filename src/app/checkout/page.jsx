"use client";
import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/lib/features/auth/cartSlice";
import { selectIsAuthenticated, selectAuthLoading, checkAuthStatus } from "@/lib/features/auth/authSlice";
import axios from "axios";
import { FiShoppingCart, FiPackage, FiCreditCard, FiEdit2, FiArrowRight } from "react-icons/fi";

// Import refactored components
import ShippingAddressForm from "@/components/Checkout/ShippingAddressForm";
import PaymentMethodSelection from "@/components/Checkout/PaymentMethodSelection";
import OrderSummaryAndItems from "@/components/Checkout/OrderSummaryAndItems";
import CheckoutMessages from "@/components/Checkout/CheckoutMessages";

export default function Checkout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);
  const cart = useSelector((state) => state.cart.items);
  const loadingCart = useSelector((state) => state.cart.loading);
  const cartErrorObject = useSelector((state) => state.cart.error);
  const cartErrorMessage = cartErrorObject?.message;

  // Local state
  const [authCheckInitiated, setAuthCheckInitiated] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [localCheckoutSuccessMessage, setLocalCheckoutSuccessMessage] = useState("");
  const [localCheckoutErrorMessage, setLocalCheckoutErrorMessage] = useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isFetchingAddresses, setIsFetchingAddresses] = useState(false);

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    type: "Home",
    isDefault: false,
    paymentMethod: "Razorpay",
    orderNotes: "",
  });

  // Handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  }, []);

  const handleSelectAddress = useCallback((selectedAddress) => {
    setShippingInfo((prevInfo) => ({
      ...prevInfo,
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phone,
      line1: selectedAddress.line1,
      line2: selectedAddress.line2 || "",
      city: selectedAddress.city,
      state: selectedAddress.state,
      zip: selectedAddress.zip,
      country: selectedAddress.country || "India",
      type: selectedAddress.type || "Home",
    }));
  }, []);

  const fetchUserAddresses = async () => {
    setIsFetchingAddresses(true);
    setLocalCheckoutErrorMessage("");
    try {
      const response = await axios.get(`${BACKEND_URL}/api/addresses`, {
        withCredentials: true,
      });
      setSavedAddresses(response.data.addresses || []);
      if (response.data.addresses?.length > 0) {
        handleSelectAddress(response.data.addresses[0]);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setLocalCheckoutErrorMessage(error.response.data.error || "Failed to fetch saved addresses.");
      } else {
        setLocalCheckoutErrorMessage("Error fetching addresses. Please try again.");
      }
    } finally {
      setIsFetchingAddresses(false);
    }
  };

  // Effects
  useEffect(() => {
    dispatch(checkAuthStatus());
    setAuthCheckInitiated(true);
  }, [dispatch]);

  useEffect(() => {
    if (authCheckInitiated && !authLoading) {
      if (!isAuthenticated) {
        router.push(`/auth/login?returnUrl=${encodeURIComponent("/checkout")}`);
      } else {
        dispatch(fetchCart());
        fetchUserAddresses();
      }
    }
  }, [isAuthenticated, authLoading, authCheckInitiated, dispatch, router]);

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayReady(true);
      script.onerror = () => {
        setLocalCheckoutErrorMessage("Failed to load Razorpay script. Please check your internet connection.");
      };
      document.body.appendChild(script);
    };

    if (typeof window !== "undefined" && !window.Razorpay) {
      loadRazorpayScript();
    } else if (typeof window !== "undefined" && window.Razorpay) {
      setRazorpayReady(true);
    }

    return () => {
      const script = document.getElementById("razorpay-checkout-script");
      if (script) script.remove();
    };
  }, []);

  // Payment and Order Handling
  const handleRazorpayPayment = async (razorpayOrder) => {
    if (!razorpayReady) {
      setLocalCheckoutErrorMessage("Razorpay script not loaded. Please try again or refresh the page.");
      setIsProcessingOrder(false);
      return;
    }

    const options = {
      key: "rzp_test_EP96mVjBj0C4va",
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "flame&crumble",
      description: "Order Payment",
      order_id: razorpayOrder.orderId,
      handler: async function (response) {
        setLocalCheckoutSuccessMessage("Payment successful! Verifying your order...");
        setIsProcessingOrder(true);

        try {
          await axios.post(
            `${BACKEND_URL}/api/orders/payments/verify`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: razorpayOrder.dbOrderId,
            },
            { withCredentials: true }
          );
          setLocalCheckoutSuccessMessage("Order placed and payment verified successfully!");
          setTimeout(() => {
            router.push(`/order-confirmation?orderId=${razorpayOrder.dbOrderId}`);
          }, 1500);
        } catch (error) {
          console.error("Payment verification error:", error);
          setLocalCheckoutErrorMessage(
            axios.isAxiosError(error) && error.response
              ? error.response.data.error || "Payment verification failed."
              : "Payment verification failed. Please contact support."
          );
          setIsProcessingOrder(false);
        }
      },
      prefill: {
        name: shippingInfo.fullName,
        email: "customer@example.com",
        contact: shippingInfo.phone,
      },
      notes: {
        dbOrderId: razorpayOrder.dbOrderId,
      },
      theme: {
        color: "#E30B5D",
      },
      modal: {
        ondismiss: function () {
          setLocalCheckoutErrorMessage("Payment was interrupted or canceled. Please try again.");
          setIsProcessingOrder(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalCheckoutSuccessMessage("");
    setLocalCheckoutErrorMessage("");
    setIsProcessingOrder(true);

    // Validation
    if (
      !shippingInfo.fullName ||
      !shippingInfo.phone ||
      !shippingInfo.line1 ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zip
    ) {
      setLocalCheckoutErrorMessage("Please fill in all required shipping fields.");
      setIsProcessingOrder(false);
      return;
    }

    if (cart.length === 0) {
      setLocalCheckoutErrorMessage("Your cart is empty. Please add items before checking out.");
      setIsProcessingOrder(false);
      return;
    }

    if (!razorpayReady) {
      setLocalCheckoutErrorMessage("Payment system not ready. Please wait a moment or refresh the page.");
      setIsProcessingOrder(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/orders`,
        {
          shippingAddress: {
            fullName: shippingInfo.fullName,
            phone: shippingInfo.phone,
            line1: shippingInfo.line1,
            line2: shippingInfo.line2,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zip: shippingInfo.zip,
            country: shippingInfo.country,
            type: shippingInfo.type,
          },
          paymentMethod: shippingInfo.paymentMethod,
          orderNotes: shippingInfo.orderNotes,
        },
        { withCredentials: true }
      );

      const data = response.data;
      if (data.orderId && data.amount && data.currency && data.dbOrderId) {
        await handleRazorpayPayment({
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency,
          dbOrderId: data.dbOrderId,
        });
      } else {
        setLocalCheckoutErrorMessage("Failed to get payment details from the server.");
        setIsProcessingOrder(false);
      }
    } catch (error) {
      setLocalCheckoutErrorMessage(
        axios.isAxiosError(error) && error.response
          ? error.response.data.error || "An error occurred during checkout. Please try again."
          : "An error occurred during checkout. Please try again."
      );
      setIsProcessingOrder(false);
    }
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );
  const deliveryCharge = 250;
  const total = subtotal > 0 ? subtotal + deliveryCharge : 0;

  // Loading states
  if ((authCheckInitiated && authLoading) || isFetchingAddresses || (isAuthenticated && loadingCart && cart.length === 0)) {
    return (
      <main className="min-h-screen bg-[#FFF5F7] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30B5D]"></div>
      </main>
    );
  }

  // Empty cart state
  if (authCheckInitiated && !authLoading && isAuthenticated && !loadingCart && cart.length === 0) {
    return (
      <>
        <Head>
          <title>Checkout | flame&crumble</title>
          <meta name="description" content="Proceed to checkout" />
        </Head>
        <Navbar />
        <main className="min-h-screen bg-[#FFF5F7] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="bg-[#E30B5D]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingCart className="text-[#E30B5D]" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">
              It looks like there are no items in your cart. Please add some items before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center bg-[#E30B5D] hover:bg-[#C90A53] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              Continue Shopping
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Auth check pending
  if (!authCheckInitiated || (authCheckInitiated && !authLoading && !isAuthenticated)) {
    return (
      <main className="min-h-screen bg-[#FFF5F7] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30B5D]"></div>
      </main>
    );
  }

  // Main checkout page
  return (
    <>
      <Head>
        <title>Checkout | flame&crumble</title>
        <meta name="description" content="Proceed to checkout" />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-[#FFF5F7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
            <div className="w-20 h-1 bg-[#E30B5D] mx-auto"></div>
          </div>

          <CheckoutMessages
            successMessage={localCheckoutSuccessMessage}
            errorMessage={localCheckoutErrorMessage}
            cartError={cartErrorMessage}
          />

          <div className="flex flex-col lg:flex-row gap-8">
            <form className="lg:w-2/3 space-y-6" onSubmit={handleSubmit}>
              <ShippingAddressForm
                shippingInfo={shippingInfo}
                onInputChange={handleInputChange}
                savedAddresses={savedAddresses}
                onSelectAddress={handleSelectAddress}
              />

              <PaymentMethodSelection
                paymentMethod={shippingInfo.paymentMethod}
                onInputChange={handleInputChange}
              />

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <label htmlFor="orderNotes" className="block text-lg font-medium text-gray-900 mb-3">
                  <FiEdit2 className="inline-block mr-2 text-[#E30B5D]" />
                  Order Notes (Optional)
                </label>
                <textarea
                  id="orderNotes"
                  name="orderNotes"
                  rows="3"
                  value={shippingInfo.orderNotes}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                  placeholder="Any special instructions or delivery preferences."
                ></textarea>
              </div>

              <button
                type="submit"
                className={`w-full bg-[#E30B5D] hover:bg-[#C90A53] text-white py-4 rounded-xl font-semibold text-lg transition-colors shadow-md flex items-center justify-center
                  ${isProcessingOrder || loadingCart || !razorpayReady ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isProcessingOrder || loadingCart || !razorpayReady}
              >
                {isProcessingOrder ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <FiCreditCard className="mr-2" />
                    Place Order
                  </>
                )}
              </button>
            </form>

            <OrderSummaryAndItems
              cart={cart}
              subtotal={subtotal}
              shipping={deliveryCharge}
              total={total}
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}