'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import Button from '@/components/UI/Button';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setHasSubmitted(true);
    setLoading(true);

    // Basic client-side validation (already covered by required + minLength)
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        name,
        email,
        password,
      }, {
        withCredentials: true,
      });

      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        const msg = data?.error?.toLowerCase() || '';

        if (status === 400 && data.errors && Array.isArray(data.errors)) {
          // For express-validator type errors
          const frontendMsg = data.errors.map(valErr => valErr.msg).join('; ');
          setFormError(frontendMsg);
        } else if (status === 409 || msg.includes('already exists') || msg.includes('already registered')) {
          setFormError('Email already registered. Please use a different email or sign in.');
        } else {
          setFormError('Registration failed. Please try again later.');
        }
      } else if (err.request) {
        setFormError('Server not responding. Please check your internet connection or backend.');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (typeof window !== 'undefined') {
      await signIn('google', { callbackUrl: '/account' });
    }
  };

  return (
    <>
      <Head>
        <title>Register | flame&crumble</title>
        <meta name="description" content="Create a new account" />
      </Head>

      <Navbar />

      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md min-w-[325px] md:min-w-[420px] overflow-hidden">
          <div className="bg-black text-white p-6">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-gray-300">Join flame&crumble today</p>
          </div>

          <div className="p-6">
            {hasSubmitted && formError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
                <p>{formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFormError('');
                      setHasSubmitted(false);
                    }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                    required
                  />
                </div>
              </div>

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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFormError('');
                      setHasSubmitted(false);
                    }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFormError('');
                      setHasSubmitted(false);
                    }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                    required
                    minLength="6"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters
                </p>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-[#E30B5D] focus:ring-[#E30B5D] border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#E30B5D] hover:text-[#c5094f]">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[#E30B5D] hover:text-[#c5094f]">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="secondary"
                  className="w-full flex justify-center items-center"
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle className="w-5 h-5 mr-2" />
                  Sign up with Google
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-[#E30B5D] hover:text-[#c5094f]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

    </>
  );
}
