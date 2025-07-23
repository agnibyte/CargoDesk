import React, { useEffect, useState } from "react";
import styles from "@/styles/common/tabComponent.module.scss";

// const tabsData = [
//   { id: "one", label: "One" },
//   { id: "two", label: "Two" },
//   { id: "three", label: "Three" },
//   { id: "four", label: "Four" },
// ];

const TabComponent = ({ tabsData, setSelectedTab, selectedTab }) => {
  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
  };

  // useEffect(() => {
  //   if (tabsData && tabsData.length > 0) {
  //     setSelectedTab(tabsData[0].value);
  //   }
  // }, []);

  return (
    <div className={`${styles.tabs} ${styles.group}`}>
      {tabsData &&
        tabsData.map((tab) => (
          <div
            key={tab.id}
            className={selectedTab === tab.value ? styles.active : ""}
            onClick={() => handleTabClick(tab.value)}
          >
            <span className={`${styles.tabsLabel}`}>{tab.label}</span>
          </div>
        ))}
    </div>
  );
};

export default TabComponent;
