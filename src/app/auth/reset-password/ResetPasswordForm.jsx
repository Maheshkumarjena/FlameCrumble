'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiLock } from 'react-icons/fi';
import Button from '@/components/UI/Button';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      setMessage(data.message);
      router.push('/auth/login');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!email) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Invalid Request</h2>
        <p>No email provided. Please use the link from your email.</p>
        <Link href="/auth/login" className="mt-4 inline-block text-[#E30B5D] hover:text-[#c5094f]">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md min-w-[325px] md:min-w-[420px] overflow-hidden">
      <div className="bg-black text-white p-6">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-gray-300">Enter your new password</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                required
                minLength="6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                required
                minLength="6"
              />
            </div>
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full flex justify-center items-center">
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
