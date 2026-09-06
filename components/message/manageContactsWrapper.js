import React, { useState } from "react";
import TabComponent from "../common/tabComponent";
import dashboardStyle from "@/styles/dashBoard.module.scss";
// import GoogleContacts from "./googleContacts";
import AllContactsTab from "../manageContacts/allContactsTab";
import ImportContactsTab from "../manageContacts/importContactsTab";
import { useRouter } from "next/router";
import { FiSearch, FiX } from "react-icons/fi";
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
      id: "01",
      label: `All Contacts (${contactsList.length})`,
      value: "allContacts",
    },
    { id: "02", label: "Import Contacts", value: "import" },
    {
      id: "03",
      label: `All Groups (${groupsList.length})`,
      value: "allGroups",
    },
    { id: "04", label: "Create Group", value: "createGroup" },
  ];

  const [selectedTab, setSelectedTab] = useState(
    pageData.tab || contactsTabs[0].value,
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
    return (
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.contactNo.includes(searchTerm)
    );
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            MESSENGER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-1">
            Manage Contacts & Groups
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Add, import, organize, and create groups for seamless messaging.
          </p>
        </div>

        {selectedTab === "allContacts" && (
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all shadow-2xs"
              onChange={handleSearch}
              value={searchTerm}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 md:p-6 space-y-5">
        <div className="border-b border-slate-200/80">
          <TabComponent
            tabsData={contactsTabs}
            setSelectedTab={handleTabClick}
            selectedTab={selectedTab}
          />
        </div>
        {selectedTab == "allContacts" ? (
          <>
            <AllContactsTab
              pageData={pageData}
              contactsList={filteredContacts}
              setContactsList={setContactsList}
              searchTerm={searchTerm}
              setSelectedTab={setSelectedTab}
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
              setSelectedTab={setSelectedTab}
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
  );
}
