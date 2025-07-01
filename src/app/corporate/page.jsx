"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { FiGift, FiPackage, FiTruck, FiAward, FiUsers, FiMail as FiMailIcon } from 'react-icons/fi';
import Head from 'next/head';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const MessageBox = ({ type, message, onClose }) => {
  if (!message) return null;
  const baseClasses = "p-4 mb-4 rounded-md flex items-center shadow-sm";
  let typeClasses = "";
  switch (type) {
    case 'success': typeClasses = "bg-green-100 border-l-4 border-green-500 text-green-700"; break;
    case 'error': typeClasses = "bg-red-100 border-l-4 border-red-500 text-red-700"; break;
    case 'info': typeClasses = "bg-blue-100 border-l-4 border-blue-500 text-blue-700"; break;
    default: typeClasses = "bg-blue-100 border-l-4 border-blue-500 text-blue-700"; break;
  }
  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      <div className="flex-grow">
        <p className="font-medium">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-current hover:opacity-75">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

const CorporateForm = ({ formData, onChange, onSubmit, isAuthenticated, isSubmittingDisabled, loading }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#E30B5D] focus:border-[#E30B5D]"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        {isAuthenticated ? (
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        ) : (
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#E30B5D] focus:border-[#E30B5D]"
          />
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message *</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={formData.message}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#E30B5D] focus:border-[#E30B5D]"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmittingDisabled}
        className={`w-full bg-[#E30B5D] hover:bg-[#C90A53] text-white py-3 px-4 rounded-md font-medium transition-colors ${isSubmittingDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Inquiry'
        )}
      </button>
    </form>
  );
};

export default function Corporate() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formSubmissionError, setFormSubmissionError] = useState(null);
  const [formData, setFormData] = useState({ companyName: '', email: '', message: '' });

  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/auth/status`, { withCredentials: true });
      setIsAuthenticated(true);
      setAuthUser(res.data.user);
      setFormData(prev => ({ ...prev, email: res.data?.email || '' }));
    } catch {
      setIsAuthenticated(false);
      setAuthUser(null);
      setFormData(prev => ({ ...prev, email: '' }));
    } finally {
      setInitialAuthCheckDone(true);
    }
  }, []);

  useEffect(() => { checkAuthStatus(); }, [checkAuthStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email' && isAuthenticated) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmissionError(null);
    setLoadingSubmission(true);

    try {
      const templateParams = {
        from_name: formData.companyName,
        from_email: formData.email,
        message: formData.message,
      };

      const res = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      if (res.status === 200) {
        setSubmitted(true);
        setFormData({
          companyName: '',
          email: isAuthenticated && authUser?.email ? authUser.email : '',
          message: '',
        });
      } else {
        throw new Error("Failed to send email. Please try again.");
      }
    } catch (err) {
      setFormSubmissionError(err.message || "Email sending failed.");
    } finally {
      setLoadingSubmission(false);
    }
  };

  if (!initialAuthCheckDone) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30B5D]"></div>
        <p className="ml-4 text-gray-700">Loading...</p>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Corporate Gifting | flame&crumble</title>
      </Head>
      <Navbar isAuthenticated={isAuthenticated} authUser={authUser} />
<main className="min-h-screen bg-[#FFF5F7] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Corporate Gifting Solutions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Delight your clients and employees with premium, customized gift experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1">
                  <div className="bg-[#E30B5D]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    <FiGift className="text-[#E30B5D]" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Bulk Orders</h3>
                  <p className="text-gray-600">
                    Custom gift solutions for large-scale corporate events and celebrations.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1">
                  <div className="bg-[#E30B5D]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    <FiPackage className="text-[#E30B5D]" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Personalization</h3>
                  <p className="text-gray-600">
                    Brand-aligned packaging and customized messaging options.
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Customization Options</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-[#E30B5D] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                    <span>Custom packaging design</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#E30B5D] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                    <span>Personalized message cards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#E30B5D] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                    <span>Bulk quantity options</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Perfect For</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-[#E30B5D]/10 text-[#E30B5D] px-4 py-2 rounded-full flex items-center">
                    <FiAward className="mr-2" /> Corporate Events
                  </span>
                  <span className="bg-[#E30B5D]/10 text-[#E30B5D] px-4 py-2 rounded-full flex items-center">
                    <FiUsers className="mr-2" /> Employee Recognition
                  </span>
                  <span className="bg-[#E30B5D]/10 text-[#E30B5D] px-4 py-2 rounded-full flex items-center">
                    <FiMailIcon className="mr-2" /> Client Appreciation
                  </span>
                </div>
              </div>
              
              <div className="bg-[#E30B5D]/5 p-8 rounded-xl border border-[#E30B5D]/10">
                <div className="flex items-start">
                  <FiTruck className="text-[#E30B5D] mt-1 mr-3 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">PAN India Delivery</h3>
                    <p className="text-gray-700">
                      We deliver corporate gifts across all major cities in India with reliable logistics partners.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 sticky top-18">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Get Started Today</h2>
                
                {!isAuthenticated && (
                  <MessageBox 
                    type="info" 
                    message={
                      <>
                        Please <Link href={`/auth/login?returnUrl=${encodeURIComponent('/corporate')}`} className="font-bold text-[#E30B5D] hover:underline">login</Link> to send a message.
                      </>
                    } 
                  />
                )}

                {formSubmissionError && (
                  <MessageBox type="error" message={formSubmissionError} onClose={() => setFormSubmissionError(null)} />
                )}

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Thank you for your inquiry!</h4>
                      <p className="text-sm">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                ) : (
                  <CorporateForm 
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    isAuthenticated={isAuthenticated}
                    isSubmittingDisabled={!isAuthenticated || loadingSubmission}
                    loading={loadingSubmission}
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
