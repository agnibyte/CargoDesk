import React from "react";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { BsPlusCircle } from "react-icons/bs";
import { ImBin } from "react-icons/im";
import { FiEdit } from "react-icons/fi";

export default function PrevMessageCard({
  handleChange,
  item,
  copied,
  handleCopy,
  handleDelete,
  deleteMsgLoading,
}) {
  return (
    <div className="relative w-full lg:w-[48%] bg-white shadow-md rounded-lg p-4 border border-gray-200 h-min">
      <div className="absolute top-2 right-2 flex flex-wrap items-center gap-2">
        {/* Use */}
        <button
          onClick={() => handleChange("message", item.message)}
          className="flex items-center gap-1 text-xs bg-green-200 text-green-900 px-2 py-1 rounded-md hover:bg-green-300 transition"
          type="button"
        >
          <BsPlusCircle size={14} />
          Use
        </button>

        {/* Copy */}
        <button
          onClick={() => handleCopy(item)}
          className="flex items-center gap-1 text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded-md hover:bg-blue-300 transition"
          type="button"
        >
          {copied == item.id ? (
            <LuCopyCheck
              className="text-green-700"
              size={14}
            />
          ) : (
            <LuCopy
              className="text-blue-800"
              size={14}
            />
          )}
          {copied == item.id ? "Copied" : "Copy"}
        </button>

        <button
          onClick={() => handleDelete(item)}
          className="flex items-center gap-1 text-xs bg-red-200 text-red-900 px-2 py-1 rounded-md hover:bg-red-300 transition"
          type="button"
        >
          <ImBin size={14} />
          {deleteMsgLoading ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* Message Content */}
      <p className="text-gray-800 text-sm mt-6 break-words whitespace-pre-wrap">
        {item.message}
      </p>
    </div>
  );
}
