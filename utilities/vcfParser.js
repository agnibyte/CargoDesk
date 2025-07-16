export const parseVCF = (text) => {
  const entries = text.split("END:VCARD");
  return entries
    .map((entry) => {
      const nameMatch = entry.match(/FN:(.*)/);
      const phoneMatch = entry.match(/TEL.*:(.*)/);
      return {
        name: nameMatch ? nameMatch[1].trim() : "Unnamed",
        contactNo: phoneMatch ? phoneMatch[1].trim() : "",
      };
    })
    .filter((c) => c.contactNo);
};
