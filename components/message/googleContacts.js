// pages/contacts.js or components/GoogleContacts.js

import React, { useEffect, useState } from "react";

export default function GoogleContacts() {
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Dynamically import gapi-script only on the client
    const loadGapi = async () => {
      const { gapi } = await import("gapi-script");

      gapi.load("client:auth2", () => {
        gapi.client.init({
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
          scope: "https://www.googleapis.com/auth/contacts.readonly",
        });
        setGapiLoaded(true);
      });
    };

    if (typeof window !== "undefined") {
      loadGapi();
    }
  }, []);

  const signIn = () => {
    const gapi = window.gapi;
    gapi.auth2.getAuthInstance().signIn().then(fetchContacts);
  };

  const fetchContacts = () => {
    const gapi = window.gapi;
    gapi.client
      .request({
        path: "https://people.googleapis.com/v1/people/me/connections",
        params: {
          personFields: "names,emailAddresses,phoneNumbers",
          pageSize: 50,
        },
      })
      .then((res) => {
        console.log("result======", res);
        setContacts(res.result.connections || []);
      });
  };
  console.log("contacts", contacts);
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Google Contacts</h2>
      <button
        onClick={signIn}
        disabled={!gapiLoaded}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in and Fetch Contacts
      </button>

      <ul className="mt-4 space-y-2">
        {contacts.map((contact, idx) => (
          <li
            key={idx}
            className="bg-gray-100 p-2 rounded"
          >
            <strong>{contact.names?.[0]?.displayName || "Unnamed"}</strong>
            <br />
            {contact.emailAddresses?.[0]?.value || "No email"}
          </li>
        ))}
      </ul>
    </div>
  );
}
