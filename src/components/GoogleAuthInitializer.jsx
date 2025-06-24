// components/GoogleAuthInitializer.js (create this new file)
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { googleLogin } from "@/lib/features/auth/authSlice";

export default function GoogleAuthInitializer() {
  const { data: session, status , profile } = useSession();
  const dispatch = useDispatch();
  // console.log("use session cnsole.logged ==================>",useSession())

  // console.log("session======================", session , "profile =================", profile);
  useEffect(() => {
    // Only proceed if authenticated and session data
    // is available
    // console.log(
    //   "googleAuthIntializer inisiated =============================:"
    // );

    // Check if the current login provider is Google
    if (session?.user) {
      const googleAuthData = {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      };

      // Dispatch the googleLogin thunk
      dispatch(googleLogin(googleAuthData));
      setTimeout(() => {
        
        // console.log("google login dispatched")
      }, 5000);

      // OPTIONAL: You might want to do something here after dispatching,
      // like redirecting or showing a success message.
      // If your backend sets a session cookie, Redux state update might be for UI purposes.
    }
  }, [session, status, dispatch]);

  // This component doesn't need to render anything visually
  return null;
}
