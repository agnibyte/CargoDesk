import {
  getContactListController,
  getUserCntactGroups,
} from "@/backend/controllers/contactController";
import { getUserMessageTemplates } from "@/backend/controllers/messagerController";
import { getUserDetailsById } from "@/backend/controllers/userController";
import MessageWrapper from "@/components/message/messageWrapper";
import { getCurrentToken } from "@/utilities/utils";
import { parseCookies } from "nookies";
import React from "react";

export default function Messager({
  pageData,
  contacts,
  groups,
  savedTemplates,
}) {
  return (
    <>
      <MessageWrapper
        pageData={pageData}
        contacts={contacts}
        groups={groups}
        savedTemplates={savedTemplates}
      />
    </>
  );
}
export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.auth_token;

  const pageData = {};
  let contacts = [];
  let groups = [];
  let savedTemplates = [];

  const res = context.res;

  let decoded;
  if (token) {
    decoded = getCurrentToken(token);

    if (!decoded || !decoded.userId) {
      // Token invalid or doesn't contain userId → clear cookie & redirect
      res.setHeader(
        "Set-Cookie",
        serialize("auth_token", "", {
          path: "/",
          expires: new Date(0),
          httpOnly: true,
          sameSite: "lax",
        })
      );

      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  } else {
    // No token → redirect
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Token is valid → fetch user details from DB

  const [userDetails, contactsData, groupsData, savedTemplatesData] =
    await Promise.all([
      getUserDetailsById(decoded.userId),
      getContactListController(decoded.userId),
      getUserCntactGroups(decoded.userId),
      getUserMessageTemplates(decoded.userId),
    ]);

  if (contactsData?.status) {
    contacts = contactsData.data;
  }

  if (groupsData?.status) {
    groups = groupsData.data;
  }

  if (savedTemplatesData?.status) {
    savedTemplates = savedTemplatesData.data;
  }

  if (!userDetails?.status || !userDetails.data) {
    // User not found → clear cookie & redirect
    res.setHeader(
      "Set-Cookie",
      serialize("auth_token", "", {
        path: "/",
        expires: new Date(0),
        httpOnly: true,
        sameSite: "lax",
      })
    );

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Prepare structured user data
  const userData = {
    userId: userDetails.data.userId,
    firstName: userDetails.data.firstName || "",
    lastName: userDetails.data.lastName || "",
    email: userDetails.data.email || "",
    role: userDetails.data.role || "",
    status: userDetails.data.status || "",
  };

  pageData.user = userData;

  return {
    props: {
      pageData,
      contacts,
      groups,
      savedTemplates,
    },
  };
}
