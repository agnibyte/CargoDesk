import React, { useState } from "react";
import TabComponent from "../common/tabComponent";
import dashboardStyle from "@/styles/dashBoard.module.scss";
// import GoogleContacts from "./googleContacts";
import AllContactsTab from "../manageContacts/allContactsTab";
import ImportContactsTab from "../manageContacts/importContactsTab";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import AllGroupsSection from "../manageContacts/allGroupsSection";
import CreateGroupTab from "../manageContacts/createGroupTab";

export default function ManageContactsWrapper({
  pageData,
  contacts,
  groups = [],
}) {
  const [contactsList, setContactsList] = useState(contacts);
  const [groupsList, setGroupsList] = useState(groups);

  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const contactsTabs = [
    {
      id: "03",
      label: `All Groups (${groupsList.length})`,
      value: "allGroups",
    },
    { id: "04", label: "Create Group", value: "createGroup" },
    {
      id: "01",
      label: `All Contacts (${contactsList.length})`,
      value: "allContacts",
    },
    { id: "02", label: "Import Contacts", value: "import" },
  ];

  const [selectedTab, setSelectedTab] = useState(
    pageData.tab || contactsTabs[0].value
  );

  const handleTabClick = (tabId) => {
    if (pageData.tab)
      router.replace(router.pathname, undefined, { shallow: true });

    setSelectedTab(tabId);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredContacts = contactsList.filter((contact) => {
    return contact.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className={dashboardStyle.dashboardContainer}>
        <div className="m-5">
          <div className="flex flex-col shadow-lg rounded-lg">
            <div className="flex flex-col shadow-lg rounded-lg">
              <div className="card-header flex flex-col md:flex-row md:justify-between md:items-center p-4 gap-3 bg-gradient-to-r from-[#f27121] via-[#e94057] to-[#8a2387] rounded-t-lg">
                <h2 className="text-white text-lg font-semibold">
                  Manage Contacts
                </h2>

                {/* Search Box */}
                <div className="relative w-full md:w-1/3">
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    className="w-full py-2 pl-10 pr-4 rounde border-b border-gray-300 focus:outline-none focus:border-blue-600   shadow-sm text-sm"
                    onChange={handleSearch}
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <FiSearch />
                  </span>
                </div>
              </div>
            </div>

            <div className={dashboardStyle["mainTabel"]}>
              <TabComponent
                tabsData={contactsTabs}
                setSelectedTab={handleTabClick}
                selectedTab={selectedTab}
              />
            </div>
          </div>
          {selectedTab == "allContacts" ? (
            <>
              <AllContactsTab
                pageData={pageData}
                contactsList={filteredContacts}
                setContactsList={setContactsList}
                searchTerm={searchTerm}
              />
            </>
          ) : selectedTab == "allGroups" ? (
            <>
              <AllGroupsSection
                pageData={pageData}
                contactsList={filteredContacts}
                setContactsList={setContactsList}
                searchTerm={searchTerm}
                groupsList={groupsList}
                setGroupsList={setGroupsList}
              />
            </>
          ) : selectedTab == "import" ? (
            <>
              <ImportContactsTab
                pageData={pageData}
                setContactsList={setContactsList}
              />
            </>
          ) : selectedTab == "createGroup" ? (
            <>
              <CreateGroupTab
                pageData={pageData}
                setGroupsList={setGroupsList}
                contactsList={contactsList}
              />
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
