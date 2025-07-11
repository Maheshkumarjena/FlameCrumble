
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/UI/sonner";
import SessionProvider from "./provider";
import GoogleAuthInitializer from "@/components/GoogleAuthInitializer";
import Script from "next/script";
import LenisProvider from "./LenisProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >

        <Providers>
          {" "}
          {/* Wrap your application with Redux Provider */}
          <SessionProvider>
        <LenisProvider>
            <GoogleAuthInitializer />
            <Script
              src="https://checkout.razorpay.com/v1/checkout.js"
              strategy="lazyonload"
              />
            {children}
            <Toaster />
              </LenisProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
