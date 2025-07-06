"use client";
import headerStyle from "@/styles/header.module.scss";
import React, { useState } from "react";
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
  return (
    <header className="bg-white shadow-md p-3 relative z-50">
      <div className="flex items-center justify-around mx-auto px-5 gap-4 md:gap-8 w-[80%]">
        <div className="flex items-center">
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
                  <div className="absolute left-0 mt-2 bg-white shadow-md border rounded-md w-48 hidden group-hover:block z-50">
                    {item.children.map((child, cidx) => (
                      <div
                        key={cidx}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
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
        <div className="text-sm font-semibold text-red-500">{`Hello, ${convertFirstLetterCapital(
          pageData?.user?.firstName
        )}`}</div>
        <ProfileButton
          username={convertFirstLetterCapital(pageData?.user?.firstName)}
          onclickLogOut={handleLogout}
        />

        {/* Hamburger Icon */}
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden border border-blue-400 p-2 rounded"
        >
          <svg
            className="w-5 h-5 text-blue-500"
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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 bg-white shadow-md rounded-md p-4 animate-slide-down">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className="mb-2"
            >
              {item.url ? (
                <Link
                  href={item.url}
                  className="block text-sm font-semibold text-gray-700 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ) : (
                <div>
                  <button
                    onClick={() => toggleSubMenu(idx)}
                    className="w-full text-left flex justify-between items-center text-sm font-semibold text-red-600 py-2"
                  >
                    {item.title}
                    {item.children?.length > 0 && (
                      <span>{activeMenu === idx ? "▲" : "▼"}</span>
                    )}
                  </button>
                  {activeMenu === idx &&
                    item.children?.map((child, cidx) => (
                      <div
                        key={cidx}
                        className="ml-4 py-1 text-sm text-gray-700 border-l pl-2"
                      >
                        {child.title}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
          <div className="text-sm font-semibold text-red-500 mt-4">
            Hello, kiranlogin
          </div>
        </div>
      )}
    </header>
  );
}
