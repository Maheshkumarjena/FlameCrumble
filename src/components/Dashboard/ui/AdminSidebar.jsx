'use client';
import { useState, useEffect, useCallback } from 'react';
import { FiHome, FiBox, FiShoppingCart, FiUsers, FiX, FiLogOut, FiMenu, FiGlobe } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/features/auth/authSlice';

const AdminSidebar = ({ mobileSidebarOpen, setMobileSidebarOpen }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (pathname === '/admin/dashboard' || pathname === '/admin/dashboard/') {
      setActiveSection('overview');
    } else {
      const pathSegments = pathname.split('/');
      const section = pathSegments[pathSegments.length - 1];
      if (['products', 'orders', 'users'].includes(section)) {
        setActiveSection(section);
      } else {
        setActiveSection('overview');
      }
    }
  }, [pathname]);

  const handleNavigation = useCallback((section) => {
    if (section === 'overview') {
      router.push('/admin/dashboard');
    } else if (section === 'home') {
      router.push('/');
    } else {
      router.push(`/admin/dashboard/${section}`);
    }
    setMobileSidebarOpen(false);
  }, [router, setMobileSidebarOpen]);

  const handleLogout = useCallback(async (e) => {
    e?.preventDefault();
    try {
      await dispatch(logoutUser()).unwrap();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [dispatch, router]);

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-140">
        <button
          onClick={() => setMobileSidebarOpen(prev => !prev)}
          className="p-2 bg-white rounded-md shadow-md text-[#E30B5D] focus:outline-none hover:bg-[#E30B5D] hover:text-white transition-colors"
          aria-label={mobileSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {mobileSidebarOpen ? <FiX size={17} /> : <FiMenu size={17} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-150 w-64 bg-gray-900 text-white p-6
        transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col absolute sticky top-10 ">
          {mobileSidebarOpen && (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden absolute top-6 right-4 p-2 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close sidebar"
            >
              <FiX size={17} />
            </button>
          )}

          <h1 className="text-2xl font-bold text-white mb-8 flex items-center">
            <span className="bg-[#E30B5D] w-2 h-6 mr-2 rounded-full"></span>
            Admin Panel
          </h1>

          <nav className="flex-1 space-y-2">
            {['home', 'overview', 'products', 'orders', 'users'].map((section) => (
              <button
                key={section}
                onClick={() => handleNavigation(section)}
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-lg transition-all duration-200
                  ${activeSection === section ? 'bg-[#E30B5D] text-white shadow-md' : 'hover:bg-gray-800 text-gray-300 hover:text-white'}`}
                type="button"
              >
                {{
                  home: <><FiGlobe className="mr-3" size={20} /> Visit Site</>,
                  overview: <><FiHome className="mr-3" size={20} /> Dashboard</>,
                  products: <><FiBox className="mr-3" size={20} /> Products</>,
                  orders: <><FiShoppingCart className="mr-3" size={20} /> Orders</>,
                  users: <><FiUsers className="mr-3" size={20} /> Users</>,
                }[section]}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6">
            {/* <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-lg bg-gray-800 hover:bg-[#E30B5D] text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none"
              type="button"
              aria-label="Logout"
            >
              <FiLogOut className="mr-3" size={20} /> Logout
            </button> */}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;