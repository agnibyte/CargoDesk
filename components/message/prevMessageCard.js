import React from "react";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import commonStyle from "@/styles/common/common.module.scss";
import msgStyles from "@/styles/messageStyle.module.scss";
import { BsPlusCircle } from "react-icons/bs";

export default function PrevMessageCard({
  handleChange,
  item,
  copied,
  handleCopy,
}) {
  return (
    <div className="relative w-full sm:w-[48%] bg-white shadow-md rounded-lg p-4 border border-gray-200">
      {/* Buttons */}
      <div className="absolute top-2 right-2 flex gap-2">
        <div
          onClick={() => handleChange("message", item.msg)}
          className={msgStyles.useBtn}
        >
          <BsPlusCircle className="text-gray-100" />
          Use
        </div>
        <div
          onClick={() => handleCopy(item)}
          className="text-xs bg-blue-200 text-gray-800 px-2 py-1 rounded hover:bg-blue-300 cursor-pointer "
          type="button"
        >
          <span className="flex items-center gap-1">
            {copied == item.id ? (
              <LuCopyCheck className="text-green-500" />
            ) : (
              <LuCopy className="text-yellow-800" />
            )}
            {copied == item.id ? " Copied" : " Copy"}
          </span>
        </div>
      </div>

      {/* Message Content */}
      <p className="text-gray-800 text-sm whitespace-pre-wrap mt-6">
        {item.msg}
      </p>
    </div>
  );
}
