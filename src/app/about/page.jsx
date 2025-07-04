import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import Image from 'next/image';
import { Playfair_Display, Poppins } from 'next/font/google';

// Define fonts
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['400', '700'] 
});

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['300', '400', '600'] 
});

export default function AboutPage() {
  return (
    <div className={`min-h-screen bg-[#FFF5F7] flex flex-col ${poppins.className}`}>
      <Head>
        <title>About Us | flame&crumble</title>
        <meta name="description" content="Our story and mission" />
      </Head>

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-96 flex items-center justify-center bg-black text-white">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/ThreadedCandle.jpg"
              alt="About flame&crumble"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60"></div>
          </div>
          <div className="relative z-10 text-center px-4">
            <h1 className={`text-4xl md:text-6xl ${playfair.className} font-bold mb-4 text-rose-100`}>
              Our Story
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light">
              Handcrafted with love since 2023
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full">
              <span className="text-rose-400 font-medium tracking-widest">OUR MISSION</span>
              <h2 className={`text-4xl ${playfair.className} font-bold mt-2 mb-6`}>
                Crafting Exceptional Experiences
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                At flame&crumble, we pour our hearts into creating moments of joy. Every candle is hand-poured, 
                every cookie thoughtfully baked, and all chocolates meticulously crafted to transform ordinary 
                moments into extraordinary experiences.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                We believe in sustainable practices, ethical sourcing, and creating products that not only 
                delight the senses but also respect our planet.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-rose-500/30"
              >
                Shop Our Collections
              </Link>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-rose-400 font-medium tracking-widest">OUR VALUES</span>
            <h2 className={`text-4xl ${playfair.className} font-bold mt-2`}>
              What Guides Us
            </h2>
            <div className="w-20 h-1 bg-rose-300 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality',
                description: 'We use only the finest ingredients and materials, never compromising on quality.',
                icon: '✨',
              },
              {
                title: 'Sustainability',
                description: 'From packaging to production, we prioritize eco-friendly practices.',
                icon: '🌱',
              },
              {
                title: 'Community',
                description: 'We support local suppliers and give back to our community.',
                icon: '👥',
              },
            ].map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div className="text-5xl mb-6">{value.icon}</div>
                <h3 className={`text-2xl ${playfair.className} font-bold mb-4`}>
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}