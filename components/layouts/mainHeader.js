"use client";
import headerStyle from "@/styles/header.module.scss";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { menuItems } from "@/utilities/masterData"; // assumes structure with children array
import { convertFirstLetterCapital } from "@/utilities/utils";
import ProfileButton from "../common/items/profileButton";
import { postApiData } from "@/utilities/services/apiService";
import { useRouter } from "next/router";

export default function MainHeader({ pageData = {} }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const router = useRouter();

  const toggleSubMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };
  console.log("pageData", pageData);

  const a = {
    user: {
      userId: 1,
      firstName: "ss",
      lastName: "dd",
      email: "agb",
      role: "user",
      status: "1",
    },
  };

  const handleLogout = async () => {
    try {
      const response = await postApiData("LOGOUT_USER");

      if (response.status) {
        setTimeout(() => {
          router.reload();
        }, 200);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const [activeMain, setActiveMain] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  const toggleMain = (idx) => {
    setActiveMain(activeMain === idx ? null : idx);
    setActiveSub(null);
  };

  const toggleSub = (idx) => {
    setActiveSub(activeSub === idx ? null : idx);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="w-full px-4 md:px-14 py-2 flex items-center justify-between shadow-md bg-white z-50 top-0 fixed">
      {/* Hamburger Icon */}
      <button
        className="md:hidden"
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6 text-black"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center mr-52 md:mr-0">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
        />
        {/* <h1 className="text-lg font-semibold hidden sm:block">Dashboard</h1> */}
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-6 items-center">
        {menuItems.map((item, idx) =>
          item.url ? (
            <Link
              key={idx}
              href={item.url}
              className="text-sm font-medium hover:underline"
            >
              {item.title}
            </Link>
          ) : (
            <div
              className="relative group"
              key={idx}
            >
              <button className="text-sm font-medium flex items-center gap-1">
                {item.title}
                {item.children.length > 0 && (
                  <div className={headerStyle.arrow}></div>
                )}
              </button>
              {item.children?.length > 0 && (
                <div className="absolute group-hover:block z-50 hidden w-48 bg-white border border-gray-200 rounded-xl shadow-lg opacity-100">
                  {item.children.map((child, cidx) => (
                    <div
                      key={cidx}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer group"
                    >
                      {child.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </nav>

      <div
        className=""
        aria-label="Search"
      >
        <ProfileButton
          username={pageData?.user?.firstName}
          onclickLogOut={handleLogout}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-slide-in fixed top-[8vh] left-0 w-full h-full bg-gray-50 shadow-lg z-50 transition-all duration-300 overflow-y-auto">
          <div className="flex flex-col p-4">
            {menuItems.map((item, idx) => (
              <div key={idx}>
                <button
                  onClick={() => toggleMain(idx)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  {item.title}
                  {item.children && item.children.length > 0 && (
                    <span>{activeMain === idx ? "▲" : "▼"}</span>
                  )}
                </button>

                {/* Submenu */}
                {activeMain === idx && item?.children?.length > 0 && (
                  <div className="ml-5 px-2 py-2">
                    {item.children.map((child, cidx) => (
                      <>
                        <button
                          key={cidx}
                          onClick={() => toggleSub(cidx)}
                          className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                        >
                          {child.title}
                          <span>{activeSub === cidx ? "−" : "+"}</span>
                        </button>
                        {activeSub === cidx &&
                          child.subChildren &&
                          child.subChildren.length > 0 && (
                            <div className="ml-5 px-2 py-2">
                              {child.subChildren.map((subChild, scidx) => (
                                <Link
                                  key={scidx}
                                  href={subChild.url || "#"}
                                  className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
                                >
                                  {subChild.title}
                                </Link>
                              ))}
                            </div>
                          )}
                      </>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
