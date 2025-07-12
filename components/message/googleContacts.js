// pages/contacts.js or components/GoogleContacts.js
import React, { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";

export default function GoogleContacts() {
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    gapi.auth2.getAuthInstance().signIn().then(fetchContacts);
  };

  // const fetchContacts = () => {
  //   const gapi = window.gapi;
  //   gapi.client
  //     .request({
  //       path: "https://people.googleapis.com/v1/people/me/connections",
  //       params: {
  //         personFields: "names,emailAddresses,phoneNumbers",
  //         pageSize: 50,
  //       },
  //     })
  //     .then((res) => {
  //       console.log("result======", res);
  //       setContacts(res.result.connections || []);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching contacts:", error);
  //       setLoading(false);
  //     });
  // };
  const fetchContacts = () => {
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const dummyResponse = {
        connections: [
          {
            names: [{ displayName: "Suraj Sangale" }],
            emailAddresses: [{ value: "suraj@example.com" }],
            phoneNumbers: [{ value: "+919876543210" }],
          },
          {
            names: [{ displayName: "Dnyandev Sangale" }],
            emailAddresses: [{ value: "dnyan@example.com" }],
            phoneNumbers: [{ value: "+918888888888" }],
          },
          {
            names: [{ displayName: "Dnyaneshwar Shekade" }],
            emailAddresses: [{ value: "dnyaneshwar@example.com" }],
            phoneNumbers: [{ value: "+917777777777" }],
          },
        ],
      };

      console.log("Mock result ======", dummyResponse);
      setContacts(dummyResponse.connections);
      setLoading(false);
    }, 1000);
  };

  console.log("contacts", contacts);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Google Contacts</h2>

      <button
        variant="contained"
        onClick={signIn}
        disabled={!gapiLoaded || loading}
        startIcon={<FaGoogle />}
        sx={{
          backgroundColor: "#4285f4",
          color: "white",
          "&:hover": {
            backgroundColor: "#3367d6",
          },
          "&:disabled": {
            backgroundColor: "#cccccc",
          },
          textTransform: "none",
          fontWeight: 500,
          padding: "10px 20px",
        }}
      >
        {loading ? "Loading..." : "Sign in with Google"}
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
