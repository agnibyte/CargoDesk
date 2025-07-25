import { useEffect, useState, forwardRef } from "react";
import Select from "react-select";
import customSearchStyle from "@/styles/common/customSearch.module.scss";
import { getUniqueKey } from "@/utilities/utils";

const CustomSearch = forwardRef(
  ({ selectedValue, options = [], onChange, className, ...props }, ref) => {
    const instanceId = getUniqueKey();

    const mergedOptions = {
      instanceId,
      placeholder: "Select Option",
      isSearchable: true,
      menuPosition: "fixed",
      ...props,
      className: customSearchStyle["form_search"] + " " + className,
    };

    const colorStyles = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "white",
        border: "1px solid #9AB7BC",
        boxShadow: "none",
        padding: "0px",
        margin: "0px",
        "&:hover": {
          border: "1px solid #9AB7BC",
        },
      }),
      option: (styles, { isDisabled, isSelected }) => ({
        ...styles,
        color: isDisabled ? "#ccc" : isSelected ? "black" : "#333",
        backgroundColor: isSelected ? "#f0f0f0" : "white",
        borderBottom: "1px solid #F3F3F3",
        cursor: isDisabled ? "not-allowed" : "pointer",
        padding: "10px",
      }),
    };

    return (
      <Select
        ref={ref}
        {...mergedOptions}
        options={options}
        value={
          options.find((opt) => opt.value === selectedValue?.value) || null
        }
        onChange={onChange}
        styles={colorStyles}
      />
    );
  }
);

// Set the display name
CustomSearch.displayName = "CustomSearch";

export default CustomSearch;
