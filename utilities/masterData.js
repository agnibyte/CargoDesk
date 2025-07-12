export const docTableHeadCells = [
  // {
  //   id: "masterNo",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Master No.",
  // },
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "Sr. No.",
  },
  {
    id: "vehicleNo",
    numeric: false,
    disablePadding: false,
    label: "Vehicle No.",
    format: true,
  },
  {
    id: "note",
    numeric: false,
    disablePadding: false,
    label: "Note",
    format: true,
  },
  {
    id: "documentType",
    numeric: false,
    disablePadding: false,
    label: "Document Type",
    format: true,
  },
  {
    id: "expiryDate",
    numeric: false,
    disablePadding: false,
    label: "Expiry Date",
  },
  {
    id: "alertDate",
    numeric: false,
    disablePadding: false,
    label: "Alert Date",
  },
  { id: "action", numeric: false, disablePadding: false, label: "Action" },
];
export const menuItems = [
  {
    title: "Dashboard",
    id: "Dashboard",
    icon: "🌐",
    children: [],
    url: "/",
  },
  {
    title: "Documents",
    id: "documents",
    icon: "🌐",
    children: [],
    url: "/documents",
  },
  {
    title: "Messager",
    id: "Messager",
    icon: "📦",
    url: "/messager",
  },
  {
    title: "Invoice",
    id: "invoice",
    icon: "🎨",
    children: [
      {
        title: "New Invoice",
        id: "newInvoice",
        url: "/invoice/new",
      },
      {
        title: "Advanced Elements",
        id: "Advanced Elements",
        subChildren: [],
      },
      {
        title: "Forms & Tables",
        id: "Forms & Tables",
        subChildren: [
          { title: "Form Elements", id: "FormElements" },
          { title: "Advanced Forms", id: "AdvancedForms" },
          { title: "Basic Tables", id: "BasicTables" },
          { title: "Data Tables", id: "DataTables" },
          { title: "Form Elements", id: "FormElements" },
          { title: "Advanced Forms", id: "AdvancedForms" },
          { title: "Basic Tables", id: "BasicTables" },
          { title: "Data Tables", id: "DataTables" },
          { title: "Form Elements", id: "FormElements" },
          { title: "Advanced Forms", id: "AdvancedForms" },
          { title: "Basic Tables", id: "BasicTables" },
          { title: "Data Tables", id: "DataTables" },
          { title: "Form Elements", id: "FormElements" },
          { title: "Advanced Forms", id: "AdvancedForms" },
          { title: "Basic Tables", id: "BasicTables" },
          { title: "Data Tables", id: "DataTables" },
          { title: "Form Elements", id: "FormElements" },
          { title: "Advanced Forms", id: "AdvancedForms" },
          { title: "Basic Tables", id: "BasicTables" },
          { title: "Data Tables", id: "DataTables" },
          { title: "Form Elements", id: "FormElements" },
          { title: "Advanced Forms", id: "AdvancedForms" },
          { title: "Basic Tables", id: "BasicTables" },
          { title: "Data Tables", id: "DataTables" },
        ],
      },
      {
        title: "Icons",
        id: "Icons",
        children: [],
      },
    ],
  },
  {
    title: "Daily Orders",
    id: "dailyorders",
    icon: "🌍",
    children: [],
    url: "/dailyorders",
  },
  {
    title: "Apps",
    id: "Apps",
    icon: "⚙️",
    children: [],
  },
];

const smapleconatacts = [
  {
    resourceName: "people/c3881715573938456686",
    etag: "%EgkBAgkLLjc9Pj8aBAECBQciDExZWTBHUjYvblNvPQ==",
    names: [
      {
        metadata: {
          primary: true,
          source: {
            type: "CONTACT",
            id: "35de9fbf8fb4086e",
          },
          sourcePrimary: true,
        },
        displayName: "Aba",
        givenName: "Aba",
        displayNameLastFirst: "Aba",
        unstructuredName: "Aba",
      },
    ],
    phoneNumbers: [
      {
        metadata: {
          primary: true,
          source: {
            type: "CONTACT",
            id: "35de9fbf8fb4086e",
          },
        },
        value: "+91 90824 85334",
        canonicalForm: "+919082485334",
        type: "mobile",
        formattedType: "Mobile",
      },
      {
        metadata: {
          source: {
            type: "CONTACT",
            id: "35de9fbf8fb4086e",
          },
        },
        value: "+91 84249 51002",
        canonicalForm: "+918424951002",
        type: "WhatsApp",
        formattedType: "WhatsApp",
      },
    ],
  },
  {
    resourceName: "people/c6959517684702988445",
    etag: "%EgkBAgkLLjc9Pj8aBAECBQciDExZWTBHUjYvblNvPQ==",
    names: [
      {
        metadata: {
          primary: true,
          source: {
            type: "CONTACT",
            id: "60952c760cc5489d",
          },
          sourcePrimary: true,
        },
        displayName: "Bro Old 😎😎",
        familyName: "😎😎",
        givenName: "Bro Old",
        displayNameLastFirst: "😎😎, Bro Old",
        unstructuredName: "Bro Old 😎😎",
      },
    ],
    phoneNumbers: [
      {
        metadata: {
          primary: true,
          source: {
            type: "CONTACT",
            id: "60952c760cc5489d",
          },
        },
        value: "+918779395925",
        canonicalForm: "+918779395925",
        type: "mobile",
        formattedType: "Mobile",
      },
    ],
  },
  {
    resourceName: "people/c8352873953951085462",
    etag: "%EgkBAgkLLjc9Pj8aBAECBQciDExZWTBHUjYvblNvPQ==",
    names: [
      {
        metadata: {
          primary: true,
          source: {
            type: "CONTACT",
            id: "73eb5e9b0eddf396",
          },
          sourcePrimary: true,
        },
        displayName: "👑 DAD 👑",
        familyName: "👑",
        givenName: "👑",
        middleName: "DAD",
        displayNameLastFirst: "👑, 👑 DAD",
        unstructuredName: "👑 DAD 👑",
      },
    ],
    phoneNumbers: [
      {
        metadata: {
          primary: true,
          source: {
            type: "CONTACT",
            id: "73eb5e9b0eddf396",
          },
        },
        value: "+91 97023 92028",
        canonicalForm: "+919702392028",
        type: "work",
        formattedType: "Work",
      },
    ],
  },
];
