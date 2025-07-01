"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { IoMapOutline, IoMail, IoPhonePortrait, IoTimeOutline } from 'react-icons/io5';
import Head from 'next/head';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import Link from 'next/link';
import axios from 'axios';
import emailjs from '@emailjs/browser';

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
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      )}
    </div>
  );
};

const ContactForm = ({ formData, onChange, onSubmit, isAuthenticated, isSubmittingDisabled, loading }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
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
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#E30B5D] focus:border-[#E30B5D]"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
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
          'Send Message'
        )}
      </button>
    </form>
  );
};

export default function ContactPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formSubmissionError, setFormSubmissionError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/auth/status`, {
        withCredentials: true,
      });
      setIsAuthenticated(true);
      setAuthUser(res.data.user);
      setFormData((prev) => ({
        ...prev,
        email: res.data?.email || '',
      }));
    } catch {
      setIsAuthenticated(false);
      setAuthUser(null);
      setFormData((prev) => ({
        ...prev,
        email: '',
      }));
    } finally {
      setInitialAuthCheckDone(true);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email' && isAuthenticated) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmissionError(null);
    setLoadingSubmission(true);

    try {
      const emailParams = {
        from_name: formData.name,
        from_email: isAuthenticated && authUser?.email ? authUser.email : formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      const result = await emailjs.send(
        'YOUR_SERVICE_ID',      // 🔁 Replace this
        'YOUR_TEMPLATE_ID',     // 🔁 Replace this
        emailParams,
        'YOUR_PUBLIC_KEY'       // 🔁 Replace this
      );

      console.log('Email sent:', result.text);
      setSubmitted(true);
      setFormData({
        name: '',
        email: isAuthenticated && authUser?.email ? authUser.email : '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Email send error:', error);
      setFormSubmissionError('Failed to send message. Please try again.');
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
        <title>Contact Us | flame&crumble</title>
        <meta name="description" content="Get in touch with our team" />
      </Head>

      <Navbar isAuthenticated={isAuthenticated} authUser={authUser} />

      <main className="min-h-screen bg-[#FFF5F7] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get In Touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white px-8 py-3 rounded-xl shadow-sm border h-fit lg:sticky lg:top-12 border-gray-100">
              <h2 className="text-2xl font-bold mb-3 text-gray-900">Send Us a Message</h2>

              {!isAuthenticated && (
                <MessageBox
                  type="info"
                  message={
                    <>
                      Please <Link href={`/auth/login?returnUrl=${encodeURIComponent('/contact')}`} className="font-bold text-[#E30B5D] hover:underline">login</Link> to send a message.
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
                    <h4 className="font-medium">Thank you for your message!</h4>
                    <p className="text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <ContactForm
                  formData={formData}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  isAuthenticated={isAuthenticated}
                  isSubmittingDisabled={!isAuthenticated || loadingSubmission}
                  loading={loadingSubmission}
                />
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Our Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#E30B5D]/10 p-2 rounded-full mr-4">
                      <IoMapOutline className="text-[#E30B5D] w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Address</h3>
                      <p className="text-gray-600">
                        Disha Avenue
                        <br />
                        NH-16,Gosani Nuagam, Brahmapur, Odisha , India                        
                        <br />
                        760003
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#E30B5D]/10 p-2 rounded-full mr-4">
                      <IoMail className="text-[#E30B5D] w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Contact Details
                      </h3>
                      <p className="text-gray-600 mb-2">
                        <strong>Email:</strong> flameandcrumble@gmail.com
                      </p>
                      <p className="text-gray-600">
                        <strong>Phone:</strong> +91 8456816607
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#E30B5D]/10 p-2 rounded-full mr-4">
                      <IoTimeOutline className="text-[#E30B5D] w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Business Hours
                      </h3>
                      <p className="text-gray-600">
                        Monday, Wednesday - Friday: 9am - 10pm
                        <br />
                        Saturday - Sunday: 10am - 6pm
                        <br />
                        Tuesday: Closed
                      </p>
                    </div>

                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#E30B5D]/10 p-2 rounded-full mr-4">
                      <div className="text-[#E30B5D] w-5 h-5 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                      <div className="flex space-x-4">
                        <a
                          href="#"
                          className="text-gray-600 hover:text-[#E30B5D] transition-colors"
                          aria-label="Facebook"
                        >
                          <FaFacebook className="h-6 w-6" />
                        </a>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-[#E30B5D] transition-colors"
                          aria-label="Instagram"
                        >
                          <FaInstagram className="h-6 w-6" />
                        </a>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-[#E30B5D] transition-colors"
                          aria-label="Twitter"
                        >
                          <FaTwitter className="h-6 w-6" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Find Us</h3>
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-200">
                  
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3765.8979863629133!2d84.798416!3d19.286801999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTnCsDE3JzEyLjUiTiA4NMKwNDcnNTQuMyJF!5e0!3m2!1sen!2sin!4v1751386125999!5m2!1sen!2sin"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    className="w-full h-64"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
