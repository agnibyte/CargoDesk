import React from "react";
import docSecStyle from "@/styles/docSec.module.scss";

const DocumentsFilterCard = ({ item, onFilterClick, isSelected }) => {
// check change
  return (
    <button
      className={`${docSecStyle.documentCard} flex-1 text-center ${
        isSelected ? docSecStyle.selected : ""
      }`}
      onClick={() => onFilterClick(item.value)}
    >
      <div className={docSecStyle.labelWrap}>
        <div className={`${docSecStyle.label} text-primary`}>{item.label}</div>
        {item.totalCount ? (
          <div className={`${docSecStyle.label} text-danger`}>
            {item.withinMonthExpiryCount + item.expiredCount} /{" "}
            {item.totalCount}
          </div>
        ) : (
          <div className={`${docSecStyle.label} text-danger`}>-</div>
        )}
      </div>
    </button>
  );
};

export default DocumentsFilterCard;
