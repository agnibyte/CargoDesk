const GoogleSignIn = ({ setContacts }) => {
  const simulateImport = () => {
    const dummy = [
      { name: "Rahul", contactNo: "+91 9999999999" },
      { name: "Aarti", contactNo: "+91 8888888888" },
    ];
    setContacts(dummy);
  };

  return (
    <div className="w-full  bg-white border border-gray-200 rounded-xl shadow p-5">
      <button
        onClick={simulateImport}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Simulate Google Contacts Import
      </button>
    </div>
  );
};

export default GoogleSignIn;
