"use client";
import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/lib/features/auth/cartSlice";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  checkAuthStatus,
} from "@/lib/features/auth/authSlice";
import axios from "axios"; // For making API requests

// Import refactored components
import ShippingAddressForm from "@/components/Checkout/ShippingAddressForm";
import PaymentMethodSelection from "@/components/Checkout/PaymentMethodSelection";
import OrderSummaryAndItems from "@/components/Checkout/OrderSummaryAndItems";
import CheckoutMessages from "@/components/Checkout/CheckoutMessages";

export default function Checkout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  console.log("Checkout component rendered.");

  // Get state from Redux store for authentication
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);
  console.log("Redux Auth State:", { isAuthenticated, authLoading });

  // Get state from Redux store for cart
  const cart = useSelector((state) => state.cart.items);
  const loadingCart = useSelector((state) => state.cart.loading);
  const cartErrorObject = useSelector((state) => state.cart.error);
  const cartErrorMessage = cartErrorObject?.message;
  console.log("Redux Cart State:", { cart, loadingCart, cartErrorMessage });

  // Local state for UI management
  const [authCheckInitiated, setAuthCheckInitiated] = useState(false); // New state to track if auth check started
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [localCheckoutSuccessMessage, setLocalCheckoutSuccessMessage] =
    useState("");
  const [localCheckoutErrorMessage, setLocalCheckoutErrorMessage] =
    useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isFetchingAddresses, setIsFetchingAddresses] = useState(false);

  // Form state for shipping information
  // Update the shippingInfo state in your component
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "India", // Default to India if that's your primary market
    type: "Home", // Default address type
    isDefault: false,
    paymentMethod: "Razorpay", // Changed from 'creditCard' to match backend
    orderNotes: "",
  });
  console.log("Current Shipping Info:", shippingInfo);

  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log(`Input change: ${name} = ${value}`);
    setShippingInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  }, []);

  // Handle selecting a saved address
  const handleSelectAddress = useCallback((selectedAddress) => {
    console.log("Selected saved address:", selectedAddress);
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

  // Function to fetch user addresses
  const fetchUserAddresses = async () => {
    setIsFetchingAddresses(true);
    setLocalCheckoutErrorMessage(""); // Clear previous errors
    console.log("Attempting to fetch user addresses...");
    try {
      const response = await axios.get(`${BACKEND_URL}/api/addresses`, {
        withCredentials: true,
      });
      const data = response.data;
      console.log("Fetched addresses response:", data);
      setSavedAddresses(data.addresses || []);
      if (data.addresses && data.addresses.length > 0) {
        console.log("Pre-filling with first saved address.");
        handleSelectAddress(data.addresses[0]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      if (axios.isAxiosError(error) && error.response) {
        setLocalCheckoutErrorMessage(
          error.response.data.error || "Failed to fetch saved addresses."
        );
        setTimeout(() => {
          setLocalCheckoutErrorMessage("");
        }, 2000);
      } else {
        setLocalCheckoutErrorMessage(
          "Error fetching addresses. Please try again."
        );
        setTimeout(() => {
          setLocalCheckoutErrorMessage("");
        }, 2000);
      }
    } finally {
      setIsFetchingAddresses(false);
      console.log("Finished fetching user addresses.");
    }
  };

  // --- Authentication and Data Fetching Logic (Refined) ---
  useEffect(() => {
    // Only dispatch checkAuthStatus once on component mount
    console.log(
      "useEffect: Dispatching checkAuthStatus for initial auth check."
    );
    dispatch(checkAuthStatus());
    setAuthCheckInitiated(true); // Mark that auth check has started
  }, [dispatch]);

  useEffect(() => {
    console.log(
      "useEffect: Auth status listener. isAuthenticated:",
      isAuthenticated,
      "authLoading:",
      authLoading,
      "authCheckInitiated:",
      authCheckInitiated
    );

    // Only proceed if auth check has been initiated and is no longer loading
    if (authCheckInitiated && !authLoading) {
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to login.");
        // If not authenticated, redirect to login page with return URL
        router.push(`/auth/login?returnUrl=${encodeURIComponent("/checkout")}`);
      } else {
        console.log("User authenticated, fetching cart and addresses.");
        // If authenticated, fetch necessary user-specific data
        dispatch(fetchCart());
        fetchUserAddresses();
      }
    }
  }, [isAuthenticated, authLoading, authCheckInitiated, dispatch, router]);

  // Load Razorpay Checkout SDK dynamically within useEffect
  useEffect(() => {
    const loadRazorpayScript = () => {
      console.log("Loading Razorpay script...");
      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true; // Make it async
      script.onload = () => {
        console.log("Razorpay script loaded successfully.");
        setRazorpayReady(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script.");
        setLocalCheckoutErrorMessage(
          "Failed to load Razorpay script. Please check your internet connection."
        );
        setTimeout(() => setLocalCheckoutErrorMessage(""), 2000);
      };
      document.body.appendChild(script);
    };

    if (typeof window !== "undefined" && !window.Razorpay) {
      loadRazorpayScript();
    } else if (typeof window !== "undefined" && window.Razorpay) {
      console.log("Razorpay script already present.");
      setRazorpayReady(true);
    }

    // Cleanup function to remove the script if the component unmounts
    return () => {
      console.log("Cleaning up Razorpay script.");
      const script = document.getElementById("razorpay-checkout-script");
      if (script) {
        script.remove();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Calculate cart totals
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );
  // Assuming deliveryCharge is 50 INR based on your backend
  const deliveryCharge = 250;
  const total = subtotal > 0 ? subtotal + deliveryCharge : 0;
  console.log("Cart Totals:", { subtotal, deliveryCharge, total });

  /**
   * Initiates the Razorpay payment process by opening the checkout modal.
   * @param {object} razorpayOrder - Contains Razorpay order details from the backend.
   * @param {string} razorpayOrder.orderId - Razorpay's generated order ID.
   * @param {number} razorpayOrder.amount - Amount in smallest currency unit (e.g., paise).
   * @param {string} razorpayOrder.currency - Currency code (e.g., "INR").
   * @param {string} razorpayOrder.dbOrderId - Your internal database order ID.
   */
  const handleRazorpayPayment = async (razorpayOrder) => {
    console.log(
      "Attempting to open Razorpay payment modal with:",
      razorpayOrder
    );
    if (!razorpayReady) {
      setLocalCheckoutErrorMessage(
        "Razorpay script not loaded. Please try again or refresh the page."
      );
      setTimeout(() => setLocalCheckoutErrorMessage(""), 2000);

      console.log("Razorpay script not ready, cannot open modal.");
      setIsProcessingOrder(false);
      return;
    }

    const options = {
      key: "rzp_test_EP96mVjBj0C4va", // Your Public Razorpay Key ID - Ensure this is correct!
      amount: razorpayOrder.amount, // Amount in paise/cents
      currency: razorpayOrder.currency,
      name: "flame&crumble", // Your company name
      description: "Order Payment",
      order_id: razorpayOrder.orderId, // Razorpay's order ID obtained from backend
      handler: async function (response) {
        console.log("Razorpay payment successful, response:", response);
        // This function is called by Razorpay on successful payment
        setLocalCheckoutSuccessMessage(
          "Payment successful! Verifying your order..."
        );
        setTimeout(() => setLocalCheckoutSuccessMessage(""), 2000);

        setIsProcessingOrder(true); // Keep processing state while verifying payment

        try {
          // **Step 3: Verify payment on your backend using axios**
          console.log("Verifying payment on backend...");
          const verifyResponse = await axios.post(
            `${BACKEND_URL}/api/orders/payments/verify`, // Use backend URL for verification
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: razorpayOrder.dbOrderId, // Pass your internal order ID
            },
            {
              withCredentials: true, // Important for sending cookies/sessions
            }
          );

          const verificationData = verifyResponse.data; // Axios automatically parses JSON
          console.log(
            "Payment verification successful, data:",
            verificationData
          );

          setLocalCheckoutSuccessMessage(
            "Order placed and payment verified successfully!"
          );
          // Redirect only after successful verification
          setTimeout(() => {
            console.log("Redirecting to order confirmation page.");
            router.push(
              `/order-confirmation?orderId=${razorpayOrder.dbOrderId}`
            );
          }, 1500);
        } catch (error) {
          console.error("Payment verification error:", error);
          // Axios error handling for verification
          if (axios.isAxiosError(error) && error.response) {
            setLocalCheckoutErrorMessage(
              error.response.data.error || "Payment verification failed."
            );
            setTimeout(() => setLocalCheckoutErrorMessage(""), 2000);
          } else {
            setLocalCheckoutErrorMessage(
              error.message ||
                "Payment verification failed. Please contact support."
            );
            setTimeout(() => setLocalCheckoutErrorMessage(""), 2000);
          }
          setIsProcessingOrder(false); // Stop processing indication
        }
      },
      prefill: {
        name: shippingInfo.fullName,
        email: "customer@example.com", // Replace with actual user email if available
        contact: shippingInfo.phone,
      },
      notes: {
        dbOrderId: razorpayOrder.dbOrderId, // Pass your internal DB order ID to Razorpay
      },
      theme: {
        color: "#E30B5D",
      },
      modal: {
        ondismiss: function () {
          console.log("Razorpay payment modal dismissed by user.");
          setLocalCheckoutErrorMessage(
            "Payment was interrupted or canceled. Please try again."
          );
          setTimeout(() => setLocalCheckoutErrorMessage(""), 2000);

          setIsProcessingOrder(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  /**
   * Handles the form submission for placing an order.
   * This function first creates an order on the backend and then handles payment initiation.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    console.log(
      "==================================================>Handle Submit Function Called"
    );
    e.preventDefault();
    console.log("Form submission initiated.");
    setLocalCheckoutSuccessMessage("");
    setLocalCheckoutErrorMessage("");
    setIsProcessingOrder(true);

    // Basic client-side validation
    // Update the validation check in handleSubmit
    if (
      !shippingInfo.fullName ||
      !shippingInfo.phone ||
      !shippingInfo.line1 ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zip
    ) {
      console.log("Validation error: Missing shipping fields.");
      setLocalCheckoutErrorMessage(
        "Please fill in all required shipping fields."
      );
      setIsProcessingOrder(false);
      setTimeout(() => setLocalCheckoutErrorMessage(""), 5000);
      return;
    }

    if (cart.length === 0) {
      console.log("Validation error: Cart is empty.");
      setLocalCheckoutErrorMessage(
        "Your cart is empty. Please add items before checking out."
      );
      setIsProcessingOrder(false);
      setTimeout(() => setLocalCheckoutErrorMessage(""), 5000);
      return;
    }

    // Ensure Razorpay script is ready before proceeding with order creation
    if (!razorpayReady) {
      console.log("Validation error: Razorpay not ready.");
      setLocalCheckoutErrorMessage(
        "Payment system not ready. Please wait a moment or refresh the page."
      );
      setTimeout(() => setLocalCheckoutErrorMessage(""), 2000);

      setIsProcessingOrder(false);
      return;
    }

    try {
      console.log("Sending order creation request to backend...");
      // Step 1: Make API call to your backend's createOrder endpoint using axios
      // Update the order creation payload
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
        {
          withCredentials: true,
        }
      );

      const data = response.data; // Axios automatically parses JSON
      console.log("Order creation response from backend:", data);

      // Proceed with Razorpay payment immediately after order creation
      if (data.orderId && data.amount && data.currency && data.dbOrderId) {
        // Check for Razorpay fields
        console.log("Received Razorpay order details, initiating payment...");
        await handleRazorpayPayment({
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency,
          dbOrderId: data.dbOrderId, // Pass your DB order ID to Razorpay handler
        });
        // isProcessingOrder state will be managed by handleRazorpayPayment's callbacks
      } else {
        console.error(
          "Backend response missing expected Razorpay order details:",
          data
        );
        setLocalCheckoutErrorMessage(
          "Failed to get payment details from the server."
        );
        setTimeout(() => setLocalCheckoutErrorMessage(""), 2000);

        setIsProcessingOrder(false);
      }
    } catch (error) {
      console.error("Checkout process error:", error);
      // Axios error handling
      if (axios.isAxiosError(error) && error.response) {
        setLocalCheckoutErrorMessage(
          error.response.data.error ||
            "An error occurred during checkout. Please try again."
        );
        setTimeout(() => setLocalCheckoutErrorMessage(""), 2000);
      } else {
        setLocalCheckoutErrorMessage(
          error.message ||
            "An error occurred during checkout. Please try again."
        );
        setTimeout(() => setLocalCheckoutErrorMessage(""), 2000);
      }
      setTimeout(() => setLocalCheckoutErrorMessage(""), 5000);
      setIsProcessingOrder(false); // Ensure processing is stopped on error
    }
  };

  // --- Loading/Empty Cart UI based on Authentication Status ---
  // Spinner while auth check is initiated AND loading, or if addresses are fetching,
  // or if authenticated but cart is still loading AND empty (to prevent showing empty cart prematurely)
  if (
    (authCheckInitiated && authLoading) ||
    isFetchingAddresses ||
    (isAuthenticated && loadingCart && cart.length === 0)
  ) {
    console.log("Displaying loading spinner based on auth/fetch status.");
    return (
      <main className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30B5D]"></div>
      </main>
    );
  }
  // Handle empty cart case ONLY after authentication is confirmed AND cart has finished loading
  if (
    authCheckInitiated &&
    !authLoading && // Auth check complete
    isAuthenticated && // User is authenticated
    !loadingCart && // Cart has finished loading
    cart.length === 0 // Cart is empty
  ) {
    console.log("Displaying empty cart message after full auth/cart check.");
    return (
      <>
        <Head>
          <title>Checkout | flame&crumble</title>
          <meta name="description" content="Proceed to checkout" />
        </Head>
        <Navbar />
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
            <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-gray-700 mb-6">
              It looks like there are no items in your cart. Please add some
              items before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#E30B5D] hover:bg-[#c5094f] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // If initial authentication check is not yet done, or user is not authenticated (and redirect is pending),
  // prevent rendering the main form. This avoids flickering or showing the form before redirect.
  // This is a crucial guard derived from the 'Shop' page's robust auth handling.
  if (
    !authCheckInitiated ||
    (authCheckInitiated && !authLoading && !isAuthenticated)
  ) {
    console.log(
      "Auth check not complete or user not authenticated, holding render."
    );
    // Render nothing or a minimal loading spinner if you prefer
    return (
      <main className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30B5D]"></div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout | flame&crumble</title>
        <meta name="description" content="Proceed to checkout" />
      </Head>

      <Navbar />

      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
          Checkout
        </h1>

        {/* Global Messages */}
        <CheckoutMessages
          successMessage={localCheckoutSuccessMessage}
          errorMessage={localCheckoutErrorMessage}
          cartError={cartErrorMessage}
        />

        <div className="flex flex-col lg:flex-row gap-12">
          <form className="lg:w-2/3 space-y-6" onSubmit={handleSubmit}>
            {/* Shipping Information Section */}
            <ShippingAddressForm
              shippingInfo={shippingInfo}
              onInputChange={handleInputChange}
              savedAddresses={savedAddresses}
              onSelectAddress={handleSelectAddress}
            />

            {/* Payment Information Section - Simplified as it's always Razorpay */}
            <PaymentMethodSelection
              paymentMethod={shippingInfo.paymentMethod}
              onInputChange={handleInputChange}
            />

            {/* Order Notes */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <label
                htmlFor="orderNotes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Order Notes (Optional)
              </label>
              <textarea
                id="orderNotes"
                name="orderNotes"
                rows="3"
                value={shippingInfo.orderNotes}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                placeholder="Any special instructions or delivery preferences."
              ></textarea>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              className={`w-full bg-[#E30B5D] text-white py-3 rounded-lg font-semibold text-lg transition-colors shadow-md
                ${
                  isProcessingOrder || loadingCart || !razorpayReady // Button disabled if Razorpay not ready
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#c5094f]"
                }`}
              disabled={
                isProcessingOrder || loadingCart || !razorpayReady // Button disabled if Razorpay not ready
              }
            >
              {isProcessingOrder ? "Processing Order..." : "Place Order"}
            </button>
          </form>

          {/* Order Summary Section */}
          <OrderSummaryAndItems
            cart={cart}
            subtotal={subtotal}
            shipping={deliveryCharge} // Pass deliveryCharge here
            total={total}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
