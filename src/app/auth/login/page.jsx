'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import Button from '@/components/UI/Button';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/lib/features/auth/authSlice';
// import { clearAuthError } from '@/lib/features/auth/authSlice'; // If implemented
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [formError, setFormError] = useState('');
const [hasSubmitted, setHasSubmitted] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();

  const { loading, error: authErrorObject } = useSelector((state) => state.auth || {});

  const displayErrorMessage = authErrorObject?.message;

  const isUnverifiedEmailError = displayErrorMessage?.includes('Your email is not verified') || displayErrorMessage?.includes('Please verify your email');

const handleSubmit = async (e) => {
  e.preventDefault();
  setHasSubmitted(true);
  setFormError('');

  try {
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/account';
      router.push(returnUrl);
    } else {
      // Custom error mapping based on backend response code or message
      const backendMessage = resultAction.payload?.message?.toLowerCase() || '';

      if (backendMessage.includes('unauthorized') || backendMessage.includes('invalid')) {
        setFormError('Invalid email or password. Please try again.');
      } else if (backendMessage.includes('not verified')) {
        setFormError('Your email is not verified. Please verify your email to continue.');
      } else {
        setFormError('Login failed. Please check your credentials and try again.');
      }
    }
  } catch (err) {
    console.error('Unexpected error during login:', err);
    setFormError('Network error. Please check your connection and try again.');
  }
};


  const handleGoogleSignIn = async () => {
    await signIn("google");
  };
const handleEmailChange = (e) => {
  setEmail(e.target.value);
  setFormError('');
  setHasSubmitted(false);
};

const handlePasswordChange = (e) => {
  setPassword(e.target.value);
  setFormError('');
  setHasSubmitted(false);
};


  return (
    <>
      <Head>
        <title>Login | flame&crumble</title>
        <meta name="description" content="Login to your account" />
      </Head>

      <Navbar />

      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl bg-[#FFF5F7] min-w-screen flex flex-row justify-center items-center mx-auto">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md min-w-[325px] md:min-w-[420px] overflow-hidden">
          <div className="bg-black text-white p-6">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-gray-300">Login to your account</p>
          </div>

          <div className="p-6">

            {hasSubmitted && formError && (
  <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
    <strong className="block sm:inline">{formError}</strong>

    {formError.toLowerCase().includes('verify') && (
      <div className="mt-2 text-sm">
        <Link
          href={`/auth/verify-email?email=${encodeURIComponent(email)}`}
          className="text-[#E30B5D] hover:underline"
        >
          Click here to verify your email
        </Link>
      </div>
    )}
  </div>
)}


            <form onSubmit={handleSubmit} className="space-y-4">
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
                    onChange={handleEmailChange}
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
                    onChange={handlePasswordChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#E30B5D] focus:ring-[#E30B5D] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-[#E30B5D] hover:text-[#c5094f]">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.372 0 0 5.372 0 12h4z" />
                      </svg>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <FiLogIn className="mr-2" />
                      Sign In
                    </>
                  )}
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
                    Or continue with
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
                  Sign in with Google
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-medium text-[#E30B5D] hover:text-[#c5094f]">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </>
  );
}
