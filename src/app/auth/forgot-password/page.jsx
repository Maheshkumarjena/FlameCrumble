'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock } from 'react-icons/fi';
import Button from '@/components/UI/Button';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1); // 1: email input, 2: code verification
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';


  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage(data.message);
      setStep(2); // Move to verification step
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/verify-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      // Redirect to reset password page with email as query param
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password | flame&crumble</title>
      </Head>

      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl bg-[#FFF5F7] min-w-screen flex flex-row justify-center items-center mx-auto">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md min-w-[325px] md:min-w-[420px] overflow-hidden">
          <div className="bg-black text-white p-6">
            <h1 className="text-2xl font-bold">
              {step === 1 ? 'Reset Password' : 'Verify Code'}
            </h1>
            <p className="text-gray-300">
              {step === 1
                ? 'Enter your email to receive a verification code'
                : 'Enter the verification code sent to your email'}
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="block sm:inline">{error}</strong>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="block sm:inline">{message}</strong>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full flex justify-center items-center"
                  >
                    Send Verification Code
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                    required
                    pattern="\d{6}"
                    title="Please enter the 6-digit code"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Check your email for the 6-digit verification code
                  </p>
                </div>

                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full flex justify-center items-center"
                  >
                    Verify Code
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-4 text-center text-sm">
              <Link href="/auth/login" className="font-medium text-[#E30B5D] hover:text-[#c5094f]">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}