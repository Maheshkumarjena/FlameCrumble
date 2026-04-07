// components/GoogleAuthInitializer.js (create this new file)
"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { googleLogin } from "@/lib/features/auth/authSlice";

export default function GoogleAuthInitializer() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const hasDispatchedGoogleLogin = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      // Reset if the user signs out or session is not ready
      hasDispatchedGoogleLogin.current = false;
      return;
    }

    if (hasDispatchedGoogleLogin.current) {
      return;
    }

    const googleAuthData = {
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    };

    dispatch(googleLogin(googleAuthData));
    hasDispatchedGoogleLogin.current = true;
  }, [session, status, dispatch]);

  return null;
}
