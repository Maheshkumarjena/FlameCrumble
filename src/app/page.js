'use client'
import Head from 'next/head';
import Navbar from '../components/Layout/Navbar'; // Assuming Navbar can adapt to dark/light themes
import Footer from '../components/Layout/Footer'; // Assuming Footer can adapt to dark/light themes
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display, Poppins } from 'next/font/google';
import Lenis from 'lenis';
import { useEffect } from 'react'; // Import useEffect

// Initialize fonts (no change here, they are good)
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '600'] });

export default function Home() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2, // Adjust duration for smoother or faster scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
      direction: 'vertical', // vertical, horizontal
      gestureDirection: 'vertical', // vertical, horizontal, both
      smooth: true,
      mouseMultiplier: 1, // How much the mouse wheel affects scroll speed
      smoothTouch: false, // Smooth scrolling for touch devices
      touchMultiplier: 2, // How much touch scrolling affects scroll speed
      infinite: false, // Infinite scroll
    });

    // Function to handle scroll updates
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // If you are using GSAP ScrollTrigger or a similar library,
    // you would integrate it here. For example:
    // lenis.on('scroll', ScrollTrigger.update)
    // gsap.ticker.add((time) => {
    //   lenis.raf(time * 1000)
    // })

    // Cleanup Lenis instance on component unmount
    return () => {
      lenis.destroy();
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <div className="min-h-screen min-w-screen overflow-x-hidden flex flex-col bg-gray-50 text-gray-900">
      {' '}
      {/* Light base background */}
      <Head>
        <title>flame&crumble | Handcrafted Delights</title>
        <meta name="description" content="Premium handcrafted candles, cookies, and chocolates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main className={poppins.className}>
        {/* Hero Section */}
        <section
          className="relative h-screen flex items-center justify-center bg-white text-gray-900 overflow-hidden"
          data-scroll
        >
          <div className="absolute inset-0" data-scroll data-scroll-speed="-1">
            <Image
              src="/heartCandleTray.jpg"
              alt="Handcrafted delights"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-80 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
            <div
              className="absolute inset-0 z-0 opacity-10"
              style={{
                background:
                  'radial-gradient(circle at 15% 15%, rgba(236, 72, 153, 0.2), transparent 30%), radial-gradient(circle at 85% 85%, rgba(99, 102, 241, 0.2), transparent 30%)',
              }}
            />
          </div>
          <div
            className="relative z-10 text-center px-4 max-w-4xl backdrop-blur-sm bg-white/60 rounded-3xl p-6 md:p-10 border border-white/80 shadow-xl transition-all duration-300 hover:shadow-rose-300/40"
            data-scroll
            data-scroll-speed="1.5"
          >
            <h1
              className={`${playfair.className} text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-rose-800 drop-shadow-md`}
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed="2"
            >
              <span className="text-rose-600">Flame</span>
              <span className="mx-2 text-rose-800">&</span>
              <span className="text-rose-600">Crumble</span>
            </h1>
            <p className="text-lg md:text-2xl mb-10 max-w-2xl mx-auto font-light tracking-wide text-gray-700">
              Artisanal creations to elevate your space and moments
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-gradient-to-br from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-rose-500/30 transform active:scale-95"
              >
                Shop Now <span className="ml-2">→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center bg-transparent hover:bg-gray-100/50 border border-gray-400 text-gray-800 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm transform active:scale-95"
              >
                Our Story <span className="ml-2">📖</span>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-8 h-8 text-rose-600 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>
        {/* Collections Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-rose-400 font-medium tracking-widest">COLLECTIONS</span>
            <h2 className={`${playfair.className} text-4xl font-bold mt-2`}>Handcrafted Treasures</h2>
            <div className="w-20 h-1 bg-rose-300 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Candles',
                description: 'Discover Comfort',
                image: '/glassFlowerCandle.jpg',
                link: '/shop?category=candles',
              },
              {
                title: 'Chocolates',
                description: 'Handmade guilt-free chocolates',
                image: '/hmChocolates.webp',
                link: '/shop?category=chocolates',
              },
              {
                title: 'Cookies',
                description: 'Indulge in rich flavoured cookies',
                image: '/handMadeCookies.webp',
                link: '/shop?category=cookies',
              },
            ].map((collection) => (
              <div key={collection.title} className="group relative overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-8">
                  <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className={`${playfair.className} text-2xl font-bold text-white mb-2`}>
                      {collection.title}
                    </h3>
                    <p className="text-white/90 mb-6">{collection.description}</p>
                    <Link
                      href={collection.link}
                      className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      Shop Collection
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Story Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-16" data-scroll>
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 bg-white/70 backdrop-blur-lg rounded-3xl p-6 md:p-12 shadow-xl border border-gray-200/50">
            {' '}
            {/* Light Glassmorphism container */}
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 group-hover:shadow-rose-300/40 transition-shadow duration-300">
                <Image
                  src="/story.jpg"
                  alt="Our story"
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" // Subtle image scale on hover
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 bg-white/70 backdrop-blur-md p-4 md:p-6 rounded-xl shadow-lg border border-gray-300 hidden lg:block transition-all duration-300 hover:shadow-rose-300/40">
                {' '}
                {/* Light Glassmorphism callout */}
                <h3 className={`${playfair.className} text-xl md:text-2xl font-bold text-rose-600`}>Since 2023</h3>
                <p className="text-gray-700 text-sm md:text-base">Crafting with passion & love</p>
              </div>
            </div>
            <div className="lg:w-1/2 text-center lg:text-left">
              <span className="text-rose-600 font-medium tracking-widest text-sm sm:text-base">OUR JOURNEY</span>
              <h2 className={`${playfair.className} text-4xl md:text-5xl font-bold mt-2 mb-6 text-gray-900`}>
                The Art of Handcrafted Delights
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                At **flame&crumble**, we believe in the magic of handmade. Each candle is carefully poured, every cookie
                thoughtfully baked, and all chocolates meticulously crafted to transform ordinary moments into
                extraordinary experiences. We infuse passion into every creation.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center bg-gray-200/60 hover:bg-gray-300/70 text-gray-800 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 text-center backdrop-blur-sm transform active:scale-95"
                >
                  Discover Our Story <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Corporate Gifting CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center bg-gradient-to-br from-rose-50 to-purple-50 rounded-[50px] my-16 shadow-xl border border-rose-100 relative overflow-hidden" data-scroll>
          {' '}
          {/* Lighter, more pastel gradient */}
          {/* Subtle background glow for futuristic feel */}
          <div
            className="absolute inset-0 z-0 opacity-25"
            style={{
              // Increased opacity for light theme
              background:
                'radial-gradient(circle at 10% 90%, rgba(168, 85, 247, 0.1), transparent 30%), radial-gradient(circle at 90% 10%, rgba(239, 68, 68, 0.1), transparent 30%)',
            }}
          ></div>
          <span className="text-rose-600 font-medium tracking-widest text-sm sm:text-base relative z-10">
            CORPORATE GIFTING
          </span>
          <h2 className={`${playfair.className} text-4xl md:text-5xl font-bold mt-2 mb-6 text-gray-900 relative z-10`}>
            Elevate Your Corporate Relationships
          </h2>
          <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto relative z-10">
            Thoughtfully crafted gifts that speak volumes about your brand's appreciation. Make a lasting impression
            with unique, handmade treasures.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <Link
              href="/corporate"
              className="inline-flex items-center justify-center bg-gradient-to-br from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-rose-500/30 transform active:scale-95"
            >
              Corporate Collections <span className="ml-2">🎁</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-transparent hover:bg-gray-100/50 border border-gray-400 text-gray-800 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm transform active:scale-95"
            >
              Contact Our Team <span className="ml-2">📧</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}