import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "@/styles/messageStyle.module.scss";
import commonStyle from "@/styles/common/common.module.scss";
import { postApiData } from "@/utilities/services/apiService";
import PrevMessageCard from "./prevMessageCard";

export default function MessageWrapper() {
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

  const handleCheckboxChange = (item) => {
    let updatedContacts = [...formData.contacts];
    if (updatedContacts.find((c) => c.id === item.id)) {
      updatedContacts = updatedContacts.filter((c) => c.id !== item.id);
    } else {
      updatedContacts.push(item);
    }
    handleChange("contacts", updatedContacts);
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
            <h3 className={styles.heading}>Message</h3>
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

          <div className="prevMessagesWrapper">
            {/*  <h4 className={styles.subHeading}>Prev messages</h4>
            <div className={styles.prevMessages}>
              {templates.map((msg, i) => (
                <div
                  key={i}
                  className={styles.prevBubble}
                >
                  <div className={styles.bubbleHeader}>
                    <button
                      onClick={() => handleUseTemplate(msg)}
                      className={styles.useBtn}
                    >
                      Use
                    </button>
                    <button
                      onClick={() => handleCopy(msg)}
                      className={styles.copyBtn}
                    >
                      Copy
                    </button>
                  </div>
                  <p className={styles.bubbleText}>{msg}</p>
                </div>
              ))}
            </div> */}

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4">Previous Templates</h4>

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
            <button
              type="button"
              className={styles.importButton}
            >
              Import
            </button>
            <div className={styles.toggleContainer}>
              {/* Sliding Background */}
              <div
                className={styles.toggleSlider}
                style={{
                  transform:
                    selectedTab === "contacts"
                      ? "translateX(0%)"
                      : "translateX(100%)",
                }}
              />

              {/* Buttons */}
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
            {/* <div className={styles.tabs}>
              <button
                type="button"
                className={`${styles.tab} ${
                  selectedTab === "contacts" && styles.active
                }`}
                onClick={() => setSelectedTab("contacts")}
              >
                Contacts
              </button>
              <button
                type="button"
                className={`${styles.tab} ${
                  selectedTab === "groups" && styles.active
                }`}
                onClick={() => setSelectedTab("groups")}
              >
                Groups
              </button>
            </div> */}

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
                      value={contact.contactNo}
                      onChange={() => handleCheckboxChange(contact)}
                      className={styles.hiddenCheckbox}
                      checked={formData.contacts.find(
                        (c) => c.id === contact.id
                      )}
                    />
                    <span className={styles.customCheckbox}></span>
                    <div className="flex justify-between items-start w-56 md:w-sm">
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
    </>
  );
}
