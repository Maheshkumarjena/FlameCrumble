"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiLogIn,
  FiLogOut,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAdmin,
  selectIsAuthenticated,
  logoutUser,
} from "@/lib/features/auth/authSlice";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { FiArrowRightCircle, FiUserPlus } from "react-icons/fi";
import { Playfair_Display, Poppins } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "600"] });

const togglePageScroll = (disable) => {
  const body = document.body;
  if (disable) {
    body.style.overflow = "hidden";
  } else {
    body.style.overflow = "";
  }
};

const Navbar = ({ textColor = "text-black" }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = useSelector(selectIsAdmin);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Combined auth state check - works for both email and Google auth
  const showAuthContent = isAuthenticated || status === "authenticated";

  // const handleSignOut = async () => {
  //   try {
  //     // 1. Call your backend logout to clear HttpOnly cookie
  //     await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
  //       method: "POST",
  //       credentials: "include", // Include cookies
  //     });

  //     // 2. Clear NextAuth session (if used)
  //     await nextAuthSignOut({ callbackUrl: "/" });
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //     await nextAuthSignOut({ callbackUrl: "/" }); // Fallback
  //   }

  //   // 3. Close mobile menu or trigger any UI cleanup
  //   handleMobileLinkClick();
  // };

  const baseNavItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Corporate", path: "/corporate" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const navItems = isAdmin
    ? [...baseNavItems, { name: "Dashboard", path: "/admin/dashboard" }]
    : baseNavItems;

  const handleToggleMenu = useCallback(() => {
    setIsOpen((prevIsOpen) => {
      togglePageScroll(!prevIsOpen);
      return !prevIsOpen;
    });
  }, []);

  const handleMobileLinkClick = useCallback(() => {
    setIsOpen(false);
    togglePageScroll(false);
  }, []);

  useEffect(() => {
    return () => {
      togglePageScroll(false);
    };
  }, []);
  console.log("router.pathname", router);

  return (
    <nav
      className={`${poppins.className} bg-none fixed insert-0 w-full shadow-md backdrop-blur-xs z-[999] bg-[#FFF5F7]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-10">
          <div className="flex items-center">
            <Link
              href="/"
              className={`text-xl font-bold ${textColor} ${playfair.className}`}
            >
              flame&crumble
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`${
                  router.pathname === item.path ? "text-[#E30B5D]" : textColor
                } hover:text-[#E30B5D] transition-colors relative group`}
              >
                {item.name}
                <span
                  className={`absolute left-0 -bottom-1 w-${
                    router.pathname === item.path ? "full" : "0"
                  } h-0.5 bg-[#E30B5D] transition-all group-hover:w-full`}
                ></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/wishlist"
              className={`${textColor} hover:text-[#E30B5D]`}
            >
              <FiHeart size={20} />
            </Link>
            <Link href="/cart" className={`${textColor} hover:text-[#E30B5D]`}>
              <FiShoppingCart size={20} />
            </Link>
            {!showAuthContent ? (
              <div className="flex items-center space-x-4">
                {/* Sign In Button */}
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-1 text-[#E30B5D] font-[10px] border border-[#E30B5D] rounded-sm transition duration-150 ease-in-out hover:bg-[#E30B5D] hover:text-white"
                >
                  <FiArrowRightCircle className="mr-2" size={15} />
                  <button className="text-[14px] cursor-pointer">
                    {" "}
                    Sign In{" "}
                  </button>
                </Link>

                {/* Sign Up Button */}
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-4 py-1 bg-[#E30B5D] text-white border border-[#E30B5D] font-small rounded-sm transition duration-150 ease-in-out hover:bg-[#c5094f]"
                >
                  <FiUserPlus className="mr-2" size={15} />
                  <button className="text-[14px] cursor-pointer">
                    {" "}
                    Sign Up{" "}
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/account"
                  className={`${textColor} hover:text-[#E30B5D] flex items-center`}
                >
                  <FiUser size={20} />
                </Link>
                {/* <button
                  onClick={handleSignOut}
                  className={`${textColor} hover:text-[#E30B5D] flex items-center bg-transparent border-none cursor-pointer`}
                  aria-label="Sign Out"
                >
                  <FiLogOut size={20} />
                  <span className="ml-1">Sign Out</span>
                </button> */}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center z-[1000]">
            <button
              onClick={handleToggleMenu}
              className={`${textColor} hover:text-[#E30B5D] focus:outline-none`}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`${
          poppins.className
        } md:hidden w-full bg-[#FFF5F7] backdrop-blur-[10px] z-200 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
          isOpen ? "h-screen opacity-100" : "h-0 opacity-0"
        } overflow-hidden`}
      >
        {isOpen && (
          <div className="mt-[-50px] pb-3 space-y-1 sm:px-3 text-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`${
                  router.pathname === item.path
                    ? "bg-[#E30B5D] text-white"
                    : textColor
                } block px-6 py-3 rounded-md text-base text-[34px] border border-transparent hover:border-[#E30B5D] hover:scale-105 transition-all duration-200 ease-in-out`}
                onClick={handleMobileLinkClick}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex justify-center flex-col gap-8 space-x-6 px-3 py-2 mt-4">
              <div className="flex justify-evenly item-center flex-row space-x-6">
                <Link
                  href="/wishlist"
                  className={`${textColor} hover:text-[#E30B5D]`}
                  onClick={handleMobileLinkClick}
                >
                  <FiHeart size={28} />
                </Link>
                <Link
                  href="/cart"
                  className={`${textColor} hover:text-[#E30B5D]`}
                  onClick={handleMobileLinkClick}
                >
                  <FiShoppingCart size={28} />
                </Link>
                <Link
                    href="/account"
                    className={`${textColor} hover:text-[#E30B5D] flex items-center flex-col`}
                    onClick={handleMobileLinkClick}
                  >
                    <FiUser size={28} />
                  </Link>
              </div>

              {!showAuthContent ? (
                <div className="flex items-center space-x-4">
                  {/* Sign In Button */}
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center px-4 py-1 text-[#E30B5D] font-[10px] border border-[#E30B5D] rounded-sm transition duration-150 ease-in-out hover:bg-[#E30B5D] hover:text-white"
                  >
                    <FiArrowRightCircle className="mr-2" size={15} />
                    <button className="text-[14px] cursor-pointer">
                      {" "}
                      Sign In{" "}
                    </button>
                  </Link>

                  {/* Sign Up Button */}
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center px-4 py-1 bg-[#E30B5D] text-white border border-[#E30B5D] font-small rounded-sm transition duration-150 ease-in-out hover:bg-[#c5094f]"
                  >
                    <FiUserPlus className="mr-2" size={15} />
                    <button className="text-[14px] cursor-pointer">
                      {" "}
                      Sign Up{" "}
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-row justify-evenly items-center space-x-4">
                  
                  {/* <button
                    onClick={handleSignOut}
                    className={`${textColor} hover:text-[#E30B5D] flex items-center flex-row bg-transparent border-none cursor-pointer`}
                    aria-label="Sign Out"
                  >
                    <FiLogOut size={28} />
                    <span className="text-sm mt-1">Sign Out</span>
                  </button> */}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
