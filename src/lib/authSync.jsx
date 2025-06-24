// lib/authSync.js
'use client'
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { loginUser, logoutUser } from './features/auth/authSlice';

export const useAuthSync = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Sync NextAuth session to Redux
      dispatch(loginUser({
        email: session.user.email,
        name: session.user.name,
        isAdmin: session.user.isAdmin // Make sure your NextAuth callback includes this
      }));
    } else if (status === 'unauthenticated') {
      // Sync logout to Redux
      dispatch(logoutUser());
    }
  }, [status, session, dispatch]);
};