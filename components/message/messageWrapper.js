import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "@/styles/messageStyle.module.css";
import { postApiData, postSiteApiData } from "@/utilities/services/apiService";

export default function MessageWrapper() {
  const contacts = [
    { id: "01", contactNo: "+917039529129", name: "Suraj Sangale" },
    { id: "02", contactNo: "+919702392028", name: "Dnyandev Sangale" },
    { id: "03", contactNo: "+917039997894", name: "Dnyaneshwar Shekade" },
  ];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [contactsError, setContactsError] = useState(false);
  const [selectedTab, setSelectedTab] = useState("contacts");

  const onSubmit = async (data) => {
    if (!data.contacts || data.contacts.length === 0) {
      setContactsError(true);

      return;
    }

    setLoading(true);
    const req = {
      message: " hkjk\n",
      contacts: ["148368765873"],
    };
    const payload = {
      message: data.message,
      contacts: data.contacts,
    };
    setLoading(true);
    const response = await postApiData("SEND_MESSAGE", payload);

    setLoading(false);
  };

  return (
    <form
      className={styles.container}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Left side: message & previous messages */}
      <div className={styles.messageSection}>
        <div className={styles.messageWrapper}>
          <h3 className={styles.heading}>Message</h3>
          <textarea
            {...register("message", { required: true })}
            className={styles.textArea}
            rows="4"
            // defaultValue={formData ? formData.message : ""}
            // onChange={() => setContactsError(false)}
            style={errors.message ? { borderColor: "red" } : {}}
            name="message"
            id="message"
            auto
            placeholder="Type a message..."
          />
          {errors.message && (
            <span style={{ color: "red", fontSize: "0.9rem" }}>
              Message is required.
            </span>
          )}
          <button
            className={styles.sendButton}
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        <div className={styles.prevMessages}>
          <h4 className={styles.subHeading}>Prev messages</h4>
          <div className={styles.prevBubble} />
          <div className={styles.prevBubble} />
        </div>
      </div>

      {/* Right side: contacts */}
      <div className={styles.contactSection}>
        <button
          type="button"
          className={styles.importButton}
        >
          Import
        </button>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${
              selectedTab === "contacts" && styles.active
            } `}
            onClick={() => setSelectedTab("contacts")}
          >
            Contacts
          </button>
          <button
            type="button"
            className={`${styles.tab} ${
              selectedTab === "groups" && styles.active
            } `}
            onClick={() => setSelectedTab("groups")}
          >
            Groups
          </button>
        </div>

        {selectedTab == "contacts" && (
          <div className={styles.contactList}>
            {contacts.map((contact, i) => (
              <label
                key={contact.id}
                className={styles.contactItem}
              >
                <input
                  type="checkbox"
                  value={contact.contactNo}
                  {...register("contacts")}
                />
                {contact.name}
              </label>
            ))}
          </div>
        )}
        {contactsError && (
          <span style={{ color: "red", fontSize: "0.9rem" }}>
            Please select at least one contact.
          </span>
        )}
      </div>
    </form>
  );
}
