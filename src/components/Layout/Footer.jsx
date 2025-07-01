import Link from 'next/link';

const Footer = ({
  backgroundColor = 'bg-white',
  textColor = 'text-gray-800',
  hoverColor = 'hover:text-rose-500',
  navigationLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ],
  whatsappNumber = '919876543210',
  copyrightText = `© ${new Date().getFullYear()} flame&crumble. All rights reserved.`,
}) => {
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className={`${backgroundColor} ${textColor} py-12 border-t border-rose-100`}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Branding */}
        <div className="mb-6 md:mb-0">
          <Link href="/" className="text-2xl font-['Playfair_Display'] font-bold">
            <span className="text-rose-300">flame</span>
            <span className="text-gray-800">&</span>
            <span className="text-rose-300">crumble</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 mb-8 md:mb-0">
          {navigationLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.path}
              className={`${hoverColor} transition-colors duration-300 font-medium text-sm uppercase tracking-wider`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Developed By and Copyright Text */}
        <div className="flex flex-col items-center md:items-end space-y-3">
          <p className="text-gray-500 text-sm">
            Developed by{' '}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-rose-500 hover:text-rose-600 transition-colors font-medium`}
            >
              Mahesh Kumar Jena
            </a>
          </p>
          <p className="text-gray-400 text-xs">{copyrightText}</p>
        </div>
      </div>

      {/* Social Links - Added to match modern design */}
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-rose-50 flex justify-center space-x-6">
        {['Instagram', 'Facebook', 'Pinterest'].map((platform) => (
          <a 
            key={platform}
            href="#" 
            className="text-gray-500 hover:text-rose-500 transition-colors text-sm uppercase tracking-wider"
          >
            {platform}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;