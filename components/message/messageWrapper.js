import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "@/styles/messageStyle.module.css";
import { postApiData } from "@/utilities/services/apiService";

export default function MessageWrapper() {
  const contactsList = [
    { id: "01", contactNo: "+917039529129", name: "Suraj Sangale" },
    { id: "02", contactNo: "+919702392028", name: "Dnyandev Sangale" },
    { id: "02", contactNo: "+919702392028", name: "Dnyandev Sangale" },
    { id: "02", contactNo: "+919702392028", name: "Dnyandev Sangale" },
    { id: "02", contactNo: "+919702392028", name: "Dnyandev Sangale" },
    { id: "03", contactNo: "+917039997894", name: "Dnyaneshwar Shekade" },
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
  } = useForm();

  const [formData, setFormData] = useState({
    message: "",
    contacts: [],
  });
  const [loading, setLoading] = useState(false);
  const [contactsError, setContactsError] = useState(false);
  const [selectedTab, setSelectedTab] = useState("contacts");
  console.log({selectedTab})

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "contacts" && value.length > 0) setContactsError(false);
  };

  const handleCheckboxChange = (contactNo) => {
    let updatedContacts = [...formData.contacts];
    if (updatedContacts.includes(contactNo)) {
      updatedContacts = updatedContacts.filter((c) => c !== contactNo);
    } else {
      updatedContacts.push(contactNo);
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
      contacts: formData.contacts,
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
              {...register("message", { required: true })}
            />
            {errors.message && (
              <span style={{ color: "red", fontSize: "0.9rem" }}>
                Message is required.
              </span>
            )}
          </div>

          <div className="prevMessagesWrapper">
            <h4 className={styles.subHeading}>Prev messages</h4>
            <div className={styles.prevMessages}>
              <div className={styles.prevBubble} />
              <div className={styles.prevBubble} />
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
                      formData.contacts.includes(contact.contactNo)
                        ? styles.selected
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={contact.contactNo}
                      checked={formData.contacts.includes(contact.contactNo)}
                      onChange={() => handleCheckboxChange(contact.contactNo)}
                      className={styles.hiddenCheckbox}
                    />
                    <span className={styles.customCheckbox}></span>
                    <div className="flex flex-col items-start">
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
