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
  },
  {
    id: "note",
    numeric: false,
    disablePadding: false,
    label: "Note",
  },
  {
    id: "documentType",
    numeric: false,
    disablePadding: false,
    label: "Document Type",
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
        children: [],
      },
      {
        title: "Forms & Tables",
        id: "Forms & Tables",
        children: [
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
