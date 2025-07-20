import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "@/styles/messageStyle.module.scss";
import commonStyle from "@/styles/common/common.module.scss";
import { postApiData } from "@/utilities/services/apiService";
import PrevMessageCard from "./prevMessageCard";
import CommonModal from "../common/commonModal";
import GoogleContacts from "./googleContacts";
import Link from "next/link";

export default function MessageWrapper({ pageData }) {
  const contactsList = [
    {
      id: "01",
      contactNo: "+917039529129",
      name: "Suraj Sangale",
    },
    {
      id: "02",
      contactNo: "+917039529129",
      name: "Suraj Sangale",
    },
    {
      id: "03",
      contactNo: "+917039529129",
      name: "Suraj Sangale",
    },
    {
      id: "04",
      contactNo: "+917039529129",
      name: "Suraj Sangale",
    },
    {
      id: "05",
      contactNo: "+917039529129",
      name: "Suraj Sangale",
    },
    {
      id: "06",
      contactNo: "+917039529129",
      name: "Suraj Sangale",
    },
    {
      id: "07",
      contactNo: "+917039529129",
      name: "Suraj Sangale",
    },
    {
      id: "08",
      contactNo: "+917039529129",
      name: "Suraj Sangale",
    },
    {
      id: "09",
      contactNo: "+917039529129",
      name: "Suraj Sangale",
    },
    {
      id: "10",
      contactNo: "+917039529129",
      name: "Suraj Sangale",
    },
  ];
  const groupsList = [
    {
      id: "01",
      groupName: "Family",
      members: ["+917039529129", "+919702392028"],
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [formData, setFormData] = useState({
    message: "",
    contacts: [],
  });
  const [loading, setLoading] = useState(false);
  const [contactsError, setContactsError] = useState(false);
  const [selectedTab, setSelectedTab] = useState("contacts");
  const [validations, setValidations] = useState({});
  const [copied, setCopied] = useState(false);
  const [prevTemplatePoup, setPrevTemplatePopup] = useState(false);

  const prevTemlateHeading = "Previous Templates";

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
    if (formData.contacts.length === 0) {
      setContactsError(true);
      return;
    }

    setLoading(true);

    const payload = {
      message: formData.message,
      contacts: formData.contacts.map((c) => c.contactNo), // Assuming contactNo is the identifier
    };

    try {
      await postApiData("SEND_MESSAGE", payload);
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

  return (
    <>
      <form
        className={styles.container}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.messageSection}>
          <div className={styles.messageWrapper}>
            <div className=" flex items-center justify-between mb-4">
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
              <h4 className="text-lg font-semibold mb-4">
                {prevTemlateHeading}
              </h4>

              <div className="flex flex-wrap gap-4">
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
                Contacts
              </button>
              <button
                className={`${styles.toggleBtn} ${
                  selectedTab === "groups" ? styles.active : ""
                }`}
                onClick={() => handleToggle("groups")}
                type="button"
              >
                Groungs
              </button>
            </div>

            {selectedTab === "contacts" ? (
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
                      <span className={styles.contactName}>{contact.name}</span>
                      <span className={styles.contactNo}>
                        {contact.contactNo}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className={styles.contactList}>
                {groupsList.map((contact) => (
                  <div
                    key={contact.id}
                    className={styles.contactItem}
                  >
                    <span className={styles.contactName}>
                      {contact.groupName}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                      {contact.members.length}
                    </div>
                    {/* when user hver on item little poup will show contacts in small popup */}

                    {/* <span className={styles.contactNo}>
                    {contact.members.join(", ")}
                  </span> */}
                  </div>
                ))}
              </div>
            )}

            {contactsError && (
              <span style={{ color: "red", fontSize: "0.9rem" }}>
                Please select at least one contact.
              </span>
            )}
          </div>
          <button
            className={styles.sendButton}
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
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
