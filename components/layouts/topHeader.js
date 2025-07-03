import React, { useState } from "react";
import headerStyle from "@/styles/header.module.scss";
import Image from "next/image";
import { menuItems } from "@/utilities/masterData";
import Link from "next/link";

export default function MainHeader() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
    setActiveSubMenu(null);
  };

  return (
    <div className={headerStyle["navbar"]}>
      <Image
        src="/logo.png"
        alt="Logo"
        width={50}
        height={50}
        className={headerStyle["logo"]}
      />
      <div className={headerStyle.menuOptions}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {item.url && item.url != "" ? (
              <Link
                href={item.url}
                className={headerStyle["menu-button"]}
                key={item.id}
              >
                {item.title}
              </Link>
            ) : (
              <div
                className={headerStyle["menu-item"]}
                key={item.id}
                // onMouseLeave={() => {
                //   setActiveMenu(null);
                //   setActiveSubMenu(null);
                // }}

                onMouseEnter={() => toggleMenu(index)}
                onMouseLeave={() => toggleMenu(null)}
              >
                <button
                  className={headerStyle["menu-button"]}
                  // onClick={() => toggleMenu(index)}
                >
                  {/* {item.icon} */}
                  {item.title}
                  {item.children.length > 0 && (
                    <svg
                      style={{ marginLeft: "6px" }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      fill="currentColor"
                      viewBox="0 0 320 512"
                    >
                      <path d="M143 352.3l-135.1-135C2.7 211.7 0 206.9 0 201.6c0-5.3 2.7-10.1 7.9-15.1l22.6-22.6c5-5.3 10-7.9 15.3-7.9s10.1 2.6 15.1 7.9l104 104 104-104c5-5.3 10-7.9 15.3-7.9s10.1 2.6 15.1 7.9l22.6 22.6c5 5 7.6 9.8 7.6 15.1s-2.6 10.1-7.9 15.1L177 352.3c-4.2 4.2-9.2 6.3-15 6.3s-10.9-2.1-15-6.3z" />
                    </svg>
                  )}
                </button>

                {item.children.length > 0 && activeMenu === index && (
                  <div className={headerStyle["dropdown"]}>
                    {item.children.map((child, cidx) => (
                      <div
                        className={`${headerStyle["dropdown-item"]} ${headerStyle["menu-item"]}`}
                        key={cidx}
                        onMouseEnter={() => setActiveSubMenu(cidx)}
                        onMouseLeave={() => setActiveSubMenu(null)}
                      >
                        {child.title}
                        {child.children?.length > 0 && (
                          <svg
                            style={{
                              marginLeft: "6px",
                              transform: "rotate(270deg)",
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            fill="currentColor"
                            viewBox="0 0 320 512"
                          >
                            <path d="M143 352.3l-135.1-135C2.7 211.7 0 206.9 0 201.6c0-5.3 2.7-10.1 7.9-15.1l22.6-22.6c5-5.3 10-7.9 15.3-7.9s10.1 2.6 15.1 7.9l104 104 104-104c5-5.3 10-7.9 15.3-7.9s10.1 2.6 15.1 7.9l22.6 22.6c5 5 7.6 9.8 7.6 15.1s-2.6 10.1-7.9 15.1L177 352.3c-4.2 4.2-9.2 6.3-15 6.3s-10.9-2.1-15-6.3z" />
                          </svg>
                        )}

                        {child.children?.length > 0 &&
                          activeSubMenu === cidx && (
                            <div className={headerStyle["submenu"]}>
                              {child.children.map((sub, sidx) => (
                                <div
                                  className={headerStyle["dropdown-item"]}
                                  key={sidx}
                                >
                                  {sub.title}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className={headerStyle["user-profile"]}>My Account</div>
    </div>
  );
}
