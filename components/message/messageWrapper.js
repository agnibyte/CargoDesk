import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "@/styles/messageStyle.module.scss";
import commonStyle from "@/styles/common/common.module.scss";
import { postApiData } from "@/utilities/services/apiService";
import PrevMessageCard from "./prevMessageCard";
import CommonModal from "../common/commonModal";
import GoogleContacts from "./googleContacts";

import { RiSendPlaneFill } from "react-icons/ri";
import Link from "next/link";

export default function MessageWrapper({
  pageData,
  contacts = [],
  groups = [],
}) {
  const [contactsList] = useState(contacts);
  const [groupsList] = useState(groups); // test data

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [formData, setFormData] = useState({
    message: "",
    contacts: [],
    groups: [],
  });
  const [loading, setLoading] = useState(false);
  const [contactsError, setContactsError] = useState(false);
  const [contactsErrorMsg, setContactsErrorMsg] = useState("");
  const [selectedTab, setSelectedTab] = useState("contacts");
  const [validations, setValidations] = useState({});
  const [copied, setCopied] = useState(false);
  const [prevTemplatePoup, setPrevTemplatePopup] = useState(false);
  const [sendMsgApiError, setSendMsgApiError] = useState("");
  const [showAddMsgTemplet, setShowAddMsgTemplet] = useState(false);
  const [savedMsgTemplets, setSavedMsgTemplets] = useState([]);
  const [newTemplateText, setNewTemplateText] = useState("");
  const [addMsgLoading, setAddMsgLoading] = useState(false);

  const handleSaveTemplate = async () => {
    if (!newTemplateText.trim()) return;

    setAddMsgLoading(true);

    // Optionally save to API or just update local list
    const newTemplate = {
      msg: newTemplateText.trim(),
    };

    const response = await postApiData("ADD_MESSAGE_TEMPLATE", newTemplate);
    if (response.status) {
      setSavedMsgTemplets((prev) => [
        { ...newTemplate, id: response.templateId },
        ...prev,
      ]); // or update your template state if dynamic
      setNewTemplateText("");
      setShowAddMsgTemplet(false);
    } else {
      setAddMsgLoading(false);
    }
    setSavedMsgTemplets((prev) => [newTemplate, ...prev]); // or update your template state if dynamic
    setNewTemplateText("");
    setShowAddMsgTemplet(false);
  };

  const prevTemlateHeading = "Saved Templates";

  useEffect(() => {
    register("message", {
      required: "Please enter a message",
      maxLength: {
        value: 500,
        message: "Message cannot exceed 500 characters",
      },
    });
  }, [register]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValue(field, value, { shouldValidate: true });

    if (field === "contacts" && value.length > 0) setContactsError(false);
  };

  const handleCheckboxChange = (contact) => {
    setContactsError(false);

    setFormData((prev) => {
      const exists = prev.contacts.find((c) => c.id === contact.id);
      if (exists) {
        return {
          ...prev,
          contacts: prev.contacts.filter((c) => c.id !== contact.id),
        };
      } else {
        return {
          ...prev,
          contacts: [...prev.contacts, contact],
        };
      }
    });
  };

  const onSubmit = async () => {
    if (formData.contacts.length === 0 && formData.groups.length === 0) {
      setContactsError(true);
      return;
    }

    setLoading(true);

    // const payload = {
    //   message: formData.message,
    //   contacts: formData.contacts.map((c) => c.contactNo), // Assuming contactNo is the identifier
    // };
    const contactNumbers = [
      ...formData.contacts.map((c) => c.contactNo),
      ...formData.groups.flatMap((group) =>
        group.contactIds.map((id) => {
          const match = contactsList.find((c) => c.id === id);
          return match ? match.contactNo : null;
        })
      ),
    ].filter(Boolean); // remove nulls just in case
    if (contactNumbers.length === 0) {
      setContactsError(true);
      setContactsErrorMsg("No contacts found in selection.");
      setLoading(false);

      return;
    }

    const payload = {
      message: formData.message,
      contacts: [...new Set(contactNumbers)], // remove duplicates
    };

    try {
      const response = await postApiData("SEND_MESSAGE", payload);

      if (response.status) {
        setSendMsgApiError("");
      } else {
        setSendMsgApiError(response.message);
      }
    } catch (err) {
      console.error("Message sending failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (type) => {
    setSelectedTab(type);
    // onChange && onChange(type); // pass to parent if needed
  };

  const templates = [
    { id: "01", msg: "Hello! Just checking in with you." },
    { id: "02", msg: "Don't forget our meeting at 3 PM." },
    { id: "03", msg: "Here's the update you requested." },
    { id: "03", msg: "Here's the update you requested." },
    { id: "03", msg: "Here's the update you requested." },
    { id: "03", msg: "Here's the update you requested." },
    { id: "03", msg: "Here's the update you requested." },
    { id: "03", msg: "Here's the update you requested." },
    { id: "04", msg: "Let me know your availability." },
    { id: "04", msg: "Let me know your availability." },
    { id: "04", msg: "Let me know your availability." },
    { id: "04", msg: "Let me know your availability." },
    { id: "04", msg: "Let me know your availability." },
  ];

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item.msg);
    setCopied(item.id);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleGroupClick = (group) => {
    setContactsError(false);

    setFormData((prev) => {
      const exists = prev.groups.find((g) => g.id === group.id);
      if (exists) {
        return {
          ...prev,
          groups: prev.groups.filter((g) => g.id !== group.id),
        };
      } else {
        return {
          ...prev,
          groups: [...prev.groups, group],
        };
      }
    });
  };

  return (
    <>
      <form
        className={styles.container}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.messageSection}>
          <div className={styles.messageWrapper}>
            <div className=" flex items-center justify-between">
              <h3 className={styles.heading}>Message</h3>
              <button
                type="button"
                className={`md:hidden border border-amber-500 text-amber-600 font-bold px-4 py-2 hover:bg-amber-400 hover:text-amber-50 hover:border-amber-600 cursor-pointer transition-colors duration-200 rounded-full`}
                onClick={() => setPrevTemplatePopup(true)}
              >
                {prevTemlateHeading}
              </button>
            </div>
            <textarea
              name="message"
              rows="4"
              placeholder="Type a message..."
              className={styles.textArea}
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              style={errors.message ? { borderColor: "red" } : {}}
            />
            {errors.message && (
              <span className={commonStyle.errorMsg}>
                {errors.message.message}
              </span>
            )}
          </div>

          <div className="prevMessagesWrapper hidden sm:block">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">{prevTemlateHeading}</h4>
                <button
                  type="button"
                  className={commonStyle.commonButtonOutline}
                  onClick={() => setShowAddMsgTemplet(!showAddMsgTemplet)}
                >
                  {showAddMsgTemplet ? "Cancel" : "Add New"}
                </button>
              </div>
              {showAddMsgTemplet ? (
                <div className="mt-4 space-y-2 ">
                  <label className="block font-medium text-gray-700">
                    New Message Template
                  </label>
                  <textarea
                    rows="3"
                    className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message to save as a template"
                    value={newTemplateText}
                    name="newTemplateText"
                    onChange={(e) => setNewTemplateText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className={`${commonStyle.commonButton} "px-4 py-2 rounded transition"`}
                      onClick={handleSaveTemplate}
                      disabled={!newTemplateText.trim()}
                    >
                      Save Template
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 h-[40vh]  overflow-y-auto">
                  {templates.map((item, i) => (
                    <React.Fragment key={i}>
                      <PrevMessageCard
                        item={item}
                        handleChange={handleChange}
                        copied={copied}
                        handleCopy={handleCopy}
                      />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className={styles.contactSection}>
            <Link
              href="/messager/manage-contacts"
              className={styles.importButton}
            >
              Manage Contacts
            </Link>

            <div className={styles.toggleContainer}>
              <div
                className={styles.toggleSlider}
                style={{
                  transform:
                    selectedTab === "contacts"
                      ? "translateX(0%)"
                      : "translateX(100%)",
                }}
              />

              <button
                className={`${styles.toggleBtn} ${
                  selectedTab === "contacts" ? styles.active : ""
                }`}
                onClick={() => handleToggle("contacts")}
                type="button"
              >
                Contacts ({contactsList.length})
              </button>
              <button
                className={`${styles.toggleBtn} ${
                  selectedTab === "groups" ? styles.active : ""
                }`}
                onClick={() => handleToggle("groups")}
                type="button"
              >
                Groungs ({groupsList.length})
              </button>
            </div>

            {selectedTab === "contacts" ? (
              <>
                {contactsList.length > 0 ? (
                  <div className={styles.contactList}>
                    {contactsList.map((contact) => (
                      <label
                        key={contact.id}
                        className={`${styles.contactItem} ${
                          formData.contacts.find((c) => c.id === contact.id)
                            ? styles.selected
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          className={styles.hiddenCheckbox}
                          checked={
                            !!formData.contacts.find((c) => c.id === contact.id)
                          }
                          onChange={() => handleCheckboxChange(contact)}
                        />

                        <div className="flex justify-between items-start w-full">
                          <span className={styles.contactName}>
                            {contact.name}
                          </span>
                          <span className={styles.contactNo}>
                            {contact.contactNo}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-2">
                    No Contacts Found. You can Add Contacts from&nbsp;
                    <Link
                      href={"/messager/manage-contacts?tab=import"}
                      className="text-blue-600 underline"
                    >
                      here.
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                {groupsList.length > 0 ? (
                  <div className={styles.contactList}>
                    {groupsList.map((contact) => (
                      <div
                        key={contact.id}
                        className={`${styles.contactItem} ${
                          formData.groups.find((g) => g.id === contact.id)
                            ? styles.selected
                            : ""
                        }`}
                        onClick={() => handleGroupClick(contact)}
                      >
                        <span className={styles.contactName}>
                          {contact.groupName}
                        </span>
                        <div className="w-5 h-5 rounded-full text-white bg-gray-400 flex items-center justify-center">
                          {contact.contactIds.length}
                        </div>
                        {/* when user hver on item little poup will show contacts in small popup */}

                        {/* <span className={styles.contactNo}>
                    {contact.members.join(", ")}
                  </span> */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-2">
                    No Groups Found. You can Add Groups from&nbsp;
                    <Link
                      href={"/messager/manage-contacts?tab=createGroup"}
                      className="text-blue-600 underline"
                    >
                      here.
                    </Link>
                  </div>
                )}
              </>
            )}

            {contactsError && (
              <span style={{ color: "red", fontSize: "0.9rem" }}>
                {contactsErrorMsg || "Please select at least one contact."}
              </span>
            )}
          </div>
          <div className="md:hidden fixed bottom-0 left-0 w-full bg-white px-4 py-3 z-50">
            <button
              type="submit"
              className={styles.sendButnWrap + " md:hidden w-full"}
              disabled={
                loading ||
                (formData.contacts.length === 0 && formData.groups.length === 0)
              }
            >
              {!loading && (
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <RiSendPlaneFill />
                  </div>
                </div>
              )}
              <span>{loading ? "Sending..." : "Send"}</span>
            </button>{" "}
            {sendMsgApiError && (
              <span
                style={{ color: "red", fontSize: "0.9rem" }}
                className="mt-3 text-center"
              >
                {sendMsgApiError}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={styles.sendButnWrap + " hidden md:block mt-6"}
            disabled={
              loading ||
              (formData.contacts.length === 0 && formData.groups.length === 0)
            }
          >
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <RiSendPlaneFill />
              </div>
            </div>
            <span>{loading ? "Sending..." : "Send"}</span>
          </button>
          {sendMsgApiError && (
            <span
              style={{ color: "red", fontSize: "0.9rem" }}
              className="mt-3 text-center"
            >
              {sendMsgApiError}
            </span>
          )}
        </div>
      </form>
      <CommonModal
        modalOpen={prevTemplatePoup}
        setModalOpen={setPrevTemplatePopup}
        backDrop={false}
        modalTitle={prevTemlateHeading}
        modalSize="w-11/12 md:w-[50%] h-[75vh]"
      >
        <div className="p-4">
          <div className="flex flex-wrap gap-4 mt-1 h-[65vh] md:h-[60vh] overflow-y-auto">
            {templates.map((item, i) => (
              <PrevMessageCard
                key={i}
                item={item}
                handleChange={handleChange}
                copied={copied}
                handleCopy={handleCopy}
              />
            ))}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
