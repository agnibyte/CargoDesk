// pages/contacts.js or components/GoogleContacts.js

import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleContacts({ contacts, setContacts }) {
  const [gapiLoaded, setGapiLoaded] = useState(false);

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
    <div className="w-full  bg-white border border-gray-200 rounded-xl shadow p-5">
      <div className="flex items-center justify-between mb-7">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Google Contacts
        </h3>
      </div>
      <button
        onClick={signIn}
        disabled={!gapiLoaded}
        className="bg-white text-gray-800 px-4 py-2 rounded-full flex gap-3 shadow-md items-center border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition duration-300 ease-in-out"
      >
        <FcGoogle className="text-xl " />
        Sign in with Google
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
