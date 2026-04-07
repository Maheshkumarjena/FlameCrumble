// components/Providers.jsx
'use client'; // This component must be a Client Component

import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store';
import { useRef, useEffect } from 'react';
import { checkAuthStatus } from '@/lib/features/auth/authSlice'; // Import the thunk

export function Providers({ children }) {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    // Create the store instance once when the component mounts
    storeRef.current = makeStore();
  }

  const shouldDispatchAuthStatus = () => {
    const state = storeRef.current?.getState();
    const lastChecked = state?.auth?.lastChecked;
    return !lastChecked || Date.now() - lastChecked > 300000;
  };

  useEffect(() => {
    if (storeRef.current && shouldDispatchAuthStatus()) {
      storeRef.current.dispatch(checkAuthStatus());
    }
  }, []); // Only run once on mount

  return <Provider store={storeRef.current}>{children}</Provider>;
}
