// app/legal/page.tsx
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { IoMapOutline, IoMail, IoPhonePortrait, IoTimeOutline } from 'react-icons/io5';
import Head from 'next/head';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import Link from 'next/link';
import { Playfair_Display, Poppins } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '600'] });

export const metadata = {
  title: 'Legal Policies | flame&crumble',
  description: 'Our shipping, refund, privacy policies and terms of service',
};

export default function LegalPage() {
  return (
    <>
      <Head>
        <title>Legal Policies | flame&crumble</title>
        <meta name="description" content="Our shipping, refund, privacy policies and terms of service" />
      </Head>

      <Navbar />

      <main className={`${poppins.className} min-h-screen bg-[#FFF5F7] py-16 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}>Legal Policies</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Review our policies for shipping, returns, privacy, and terms of service
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <nav className="mb-8 p-4 bg-gray-50 rounded-lg sticky top-10 z-10">
                <div className="flex flex-wrap gap-4">
                  <a href="#shipping" className="text-[#E30B5D] hover:underline">Shipping Policy</a>
                  <a href="#terms" className="text-[#E30B5D] hover:underline">Terms & Conditions</a>
                  <a href="#refunds" className="text-[#E30B5D] hover:underline">Cancellations & Refunds</a>
                  <a href="#privacy" className="text-[#E30B5D] hover:underline">Privacy Policy</a>
                  <a href="#contact" className="text-[#E30B5D] hover:underline">Contact Us</a>
                </div>
              </nav>

              <section id="shipping" className="mb-12 scroll-mt-24">
                <h2 className={`${playfair.className} text-2xl font-bold mb-4 text-gray-900`}>Shipping Policy</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We aim to process and ship all orders within 1-3 business days of order confirmation. Shipping times may vary depending on your location and the shipping method selected.</p>
                  
                  <h3 className="text-xl font-medium">Domestic Shipping</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Standard Shipping: 7-14 business days</li>
                    <li>Express Shipping: 5-7 business days</li>
                  </ul>
                  
                </div>
              </section>

              <section id="terms" className="mb-12 scroll-mt-24">
                <h2 className={`${playfair.className} text-2xl font-bold mb-4 text-gray-900`}>Terms and Conditions</h2>
                <div className="space-y-4 text-gray-700">
                  <h3 className="text-xl font-medium">1. General Terms</h3>
                  <p>By accessing and using our website/services, you accept and agree to be bound by these Terms and Conditions.</p>
                  
                  <h3 className="text-xl font-medium">2. Account Registration</h3>
                  <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
                  
                  <h3 className="text-xl font-medium">3. Product Information</h3>
                  <p>We strive for accuracy in product descriptions and pricing but cannot guarantee all information is error-free. We reserve the right to correct any errors.</p>
                  
                  <h3 className="text-xl font-medium">4. Intellectual Property</h3>
                  <p>All content on this website, including text, graphics, logos, and images, is our property and protected by copyright laws.</p>
                </div>
              </section>

              <section id="refunds" className="mb-12 scroll-mt-24">
                <h2 className={`${playfair.className} text-2xl font-bold mb-4 text-gray-900`}>Cancellations and Refunds</h2>
                <div className="space-y-4 text-gray-700">
                  <h3 className="text-xl font-medium">Order Cancellations</h3>
                  <p>You may cancel your order within 24 hours of placement, provided the order hasn't been shipped. Once shipped, standard return policies apply.</p>
                  
                  <h3 className="text-xl font-medium">Returns</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Items must be returned within 14 days of receipt</li>
                    <li>Products must be unused, in original packaging with all tags attached</li>
                    <li>Certain items (e.g., personalized products) may not be returnable</li>
                  </ul>
                  
                  <h3 className="text-xl font-medium">Refunds</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Refunds will be processed within 5-7 business days after we receive the returned item</li>
                    <li>Original shipping charges are non-refundable</li>
                    <li>Refunds will be issued to the original payment method</li>
                  </ul>
                </div>
              </section>

              <section id="privacy" className="mb-12 scroll-mt-24">
                <h2 className={`${playfair.className} text-2xl font-bold mb-4 text-gray-900`}>Privacy Policy</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p>
                  
                  <h3 className="text-xl font-medium">Information We Collect</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Personal information (name, email, phone number) provided during account creation or checkout</li>
                    <li>Transaction details and purchase history</li>
                    <li>Device and usage information collected automatically (IP address, browser type)</li>
                  </ul>
                  
                  <h3 className="text-xl font-medium">How We Use Your Information</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>To process and fulfill your orders</li>
                    <li>To communicate with you about your account or orders</li>
                    <li>To improve our products and services</li>
                    <li>For security and fraud prevention</li>
                  </ul>
                </div>
              </section>

              <section id="contact" className="scroll-mt-24">
                <h2 className={`${playfair.className} text-2xl font-bold mb-6 text-gray-900`}>Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <IoMapOutline className="text-[#E30B5D] mr-2" />
                      Address
                    </h3>
                    <p className="mt-2 ml-6">
                      Disha Avenue<br />
                      NH-16, Gosani Nuagam<br />
                      Brahmapur, Odisha, India<br />
                      760003
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <IoMail className="text-[#E30B5D] mr-2" />
                      Email
                    </h3>
                    <p className="mt-2 ml-6">flameandcrumble@gmail.com</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <IoPhonePortrait className="text-[#E30B5D] mr-2" />
                      Phone
                    </h3>
                    <p className="mt-2 ml-6">+91 8456816607</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <IoTimeOutline className="text-[#E30B5D] mr-2" />
                      Business Hours
                    </h3>
                    <p className="mt-2 ml-6">
                      Monday, Wednesday - Friday: 9am - 10pm<br />
                      Saturday - Sunday: 10am - 6pm<br />
                      Tuesday: Closed
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit lg:sticky lg:top-4">
              <h2 className={`${playfair.className} text-xl font-bold mb-4 text-gray-900`}>Need Help?</h2>
              <p className="text-gray-600 mb-4">If you have questions about our policies, contact our support team.</p>
              
              <div className="space-y-4">
                <Link 
                  href="/contact" 
                  className="block w-full bg-[#E30B5D] hover:bg-[#C70952] text-white py-2 px-4 rounded-lg text-center transition-colors"
                >
                  Contact Support
                </Link>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium mb-2">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-[#E30B5D] transition-colors">
                      <FaFacebook className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-[#E30B5D] transition-colors">
                      <FaInstagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-[#E30B5D] transition-colors">
                      <FaTwitter className="h-5 w-5" />
                    </a>
                  </div>
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