import Head from 'next/head';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display, Poppins } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '600'] });

export default function Home() {
  return (
    <div className="min-w-screen overflow-x-hidden flex flex-col bg-white">
      <Head>
        <title>flame&crumble | Handcrafted Delights</title>
        <meta name="description" content="Premium handcrafted candles, cookies, and chocolates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main className={poppins.className}>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-black text-white">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/heartCandleTray.jpg"
              alt="Handcrafted delights"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className={`${playfair.className} text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-rose-100`}>
              <span className="text-rose-300">Flame</span>
              <span className="mx-2 text-rose-100">&</span>
              <span className="text-rose-300">Crumble</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-light tracking-wide">
              Artisanal creations to elevate your space and moments
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/shop"
                className="bg-rose-500 hover:bg-rose-600 text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-rose-500/30"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="bg-transparent hover:bg-white/10 border-2 border-white/80 text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
              >
                Our Story
              </Link>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-[60px] bg-rose-50">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/story.jpg"
                  alt="Our story"
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg hidden lg:block">
                <h3 className={`${playfair.className} text-2xl font-bold text-gray-800`}>Since 2023</h3>
                <p className="text-gray-600">Crafting with love</p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <span className="text-rose-400 font-medium tracking-widest">OUR STORY</span>
              <h2 className={`${playfair.className} text-4xl font-bold mt-2 mb-6`}>The Art of Handcrafted Delights</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                At flame&crumble, we believe in the magic of handmade. Each candle is carefully poured, 
                every cookie thoughtfully baked, and all chocolates meticulously crafted to transform 
                ordinary moments into extraordinary experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/about"
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 text-center"
                >
                  Our Journey
                </Link>

              </div>
            </div>
          </div>
        </section>

        {/* Corporate Gifting CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center bg-gradient-to-r from-rose-100 to-rose-50 rounded-[50px] my-16">
          <span className="text-rose-500 font-medium tracking-widest">CORPORATE GIFTING</span>
          <h2 className={`${playfair.className} text-4xl font-bold mt-2 mb-6`}>Elevate Your Corporate Relationships</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-700">
            Thoughtfully crafted gifts that speak volumes about your brand's appreciation
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/corporate"
              className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-rose-500/30"
            >
              Corporate Collections
            </Link>
            <Link
              href="/contact"
              className="bg-transparent hover:bg-white border-2 border-black text-black hover:text-rose-700 px-10 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Contact Our Team
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
