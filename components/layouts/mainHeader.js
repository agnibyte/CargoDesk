"use client";
import headerStyle from "@/styles/header.module.scss";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { menuItems } from "@/utilities/masterData";
import { convertFirstLetterCapital } from "@/utilities/utils";
import ProfileButton from "../common/items/profileButton";
import { postApiData } from "@/utilities/services/apiService";

export default function MainHeader({ pageData = {} }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeMain, setActiveMain] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const router = useRouter();
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile menu body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setMobileMenuOpen(false);
        setShowSearch(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const toggleSubMenu = useCallback(
    (index) => {
      setActiveMenu(activeMenu === index ? null : index);
    },
    [activeMenu]
  );

  const toggleMain = useCallback(
    (idx) => {
      setActiveMain(activeMain === idx ? null : idx);
      setActiveSub(null);
    },
    [activeMain]
  );

  const toggleSub = useCallback(
    (idx) => {
      setActiveSub(activeSub === idx ? null : idx);
    },
    [activeSub]
  );

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await postApiData("LOGOUT_USER");
      if (response.status) {
        // Show success feedback
        setTimeout(() => {
          router.reload();
        }, 200);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Show error feedback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    // Reset all menu states when closing
    if (isMobileMenuOpen) {
      setActiveMain(null);
      setActiveSub(null);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveMain(null);
    setActiveSub(null);
  };

  // Get current page title for breadcrumb
  const currentPageTitle = menuItems.find(
    (item) =>
      item.url === router.pathname ||
      item.children?.some((child) => child.url === router.pathname)
  )?.title;

  return (
    <>
      <header
        className={`w-full px-4 md:px-14 py-3 flex items-center justify-between shadow-md bg-white z-50 top-0 sticky transition-all duration-300 ${
          isScrolled ? "shadow-lg backdrop-blur-sm bg-white/95" : ""
        }`}
        role="banner"
      >
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={handleMobileMenuToggle}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            className={`w-6 h-6 text-gray-700 transition-transform duration-300 ${
              isMobileMenuOpen ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center space-x-32 md:space-x-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="Company Logo"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              {currentPageTitle && (
                <p className="text-xs text-gray-500">{currentPageTitle}</p>
              )}
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-1"
          role="navigation"
        >
          {menuItems.map((item, idx) =>
            item.url ? (
              <Link
                key={idx}
                href={item.url}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  router.pathname === item.url
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {item.title}
              </Link>
            ) : (
              <div
                className="relative group"
                key={idx}
              >
                <button
                  className="px-4 py-2 text-gray-700 rounded-lg transition-colors  flex items-center gap-2"
                  aria-haspopup="true"
                  aria-expanded={activeMenu === idx}
                >
                  {item.title}
                  {item.children?.length > 0 && (
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeMenu === idx ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>
                {item.children?.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.children.map((child, cidx) => (
                        <Link
                          key={cidx}
                          href={child.url || "#"}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </nav>

        {/* Right Section - Search, Notifications, Profile */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div
            className="relative"
            ref={searchRef}
          >
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            {showSearch && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <form
                  onSubmit={handleSearch}
                  className="p-4"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div
            className="relative"
            ref={notificationRef}
          >
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              aria-label="Notifications"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Notifications
                  </h3>
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No new notifications
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notification, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <p className="text-sm text-gray-900">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <ProfileButton
            username={pageData?.user?.firstName || "User"}
            onclickLogOut={handleLogout}
            isLoading={isLoading}
          />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0  backdrop-blur-sm bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileMenu}
          />
          <div
            ref={mobileMenuRef}
            className="fixed top-0 left-0 w-80 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden overflow-y-auto"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                />
                <h2 className="font-semibold text-gray-900">Menu</h2>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="p-4 space-y-2">
              {menuItems.map((item, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-100 last:border-b-0 pb-2 last:pb-0"
                >
                  <button
                    onClick={() => {
                      if (item.url) {
                        router.push(item.url);
                        closeMobileMenu();
                      } else {
                        toggleMain(idx);
                      }
                    }}
                    className={`w-full flex justify-between items-center p-3 text-left rounded-lg transition-colors ${
                      router.pathname === item.url
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{item.title}</span>
                    {item.children?.length > 0 && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeMain === idx ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Mobile Submenu */}
                  {activeMain === idx && item.children?.length > 0 && (
                    <div className="mt-2 ml-4 space-y-1">
                      {item.children.map((child, cidx) => (
                        <div key={cidx}>
                          <button
                            onClick={() => {
                              if (child.url) {
                                router.push(child.url);
                                closeMobileMenu();
                              } else {
                                toggleSub(cidx);
                              }
                            }}
                            className="w-full flex justify-between items-center p-2 text-left text-sm rounded-md hover:bg-gray-50"
                          >
                            <span>{child.title}</span>
                            {child.subChildren?.length > 0 && (
                              <svg
                                className={`w-3 h-3 transition-transform duration-200 ${
                                  activeSub === cidx ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            )}
                          </button>
                          {activeSub === cidx &&
                            child.subChildren?.length > 0 && (
                              <div className="mt-1 ml-4 space-y-1">
                                {child.subChildren.map((subChild, scidx) => (
                                  <Link
                                    key={scidx}
                                    href={subChild.url || "#"}
                                    onClick={closeMobileMenu}
                                    className="block p-2 text-sm text-gray-600 rounded-md hover:bg-gray-50"
                                  >
                                    {subChild.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
