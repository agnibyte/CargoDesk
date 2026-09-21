"use client";

import React, { forwardRef, useState } from "react";
import CustomSearch from "./customSearch";

/**
 * FloatingInput Component
 * Implements transparent floating label with notched outlined border and solid 3D bottom depth accent.
 */
export const FloatingInput = forwardRef(
  (
    {
      id,
      name,
      label,
      type = "text",
      placeholder = " ",
      error,
      helperText,
      required = false,
      className = "",
      containerClassName = "",
      labelClassName = "",
      icon: Icon,
      rightElement,
      disabled = false,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      children,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;
    const [isFocused, setIsFocused] = useState(false);
    const hasControlledValue =
      value !== undefined && value !== null && String(value).length > 0;

    const handleFocus = (e) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    const isError = Boolean(error);
    const errorMessage = typeof error === "object" ? error?.message : error;

    return (
      <div className={`w-full ${containerClassName}`}>
        <div
          className={`relative group floating-group ${
            hasControlledValue || isFocused ? "is-floated" : ""
          }`}
        >
          {/* 4bb7ff focus color */}
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-[#4bb7ff] transition-colors z-10">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder || " "}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`peer w-full px-4 py-3.5 text-sm bg-transparent text-slate-900 rounded-xl border-0 outline-none placeholder-transparent focus:placeholder-slate-400/50 ${
              Icon ? "pl-11" : ""
            } ${rightElement ? "pr-11" : ""} ${
              disabled ? "text-slate-400 cursor-not-allowed" : ""
            } ${className}`}
            {...props}
          />

          {/* Notched Outline Fieldset (Cuts top border to exact label text width + applies 3D bottom depth) */}
          <fieldset
            aria-hidden="true"
            className={`notched-outline transition-all duration-200 ${
              isError
                ? "border-red-500 shadow-[0_3px_0_0_#ef4444]"
                : "border-slate-200/90 group-hover:border-slate-300 group-focus-within:border-[#4bb7ff] group-focus-within:shadow-[0_3px_0_0_#4bb7ff]"
            } ${disabled ? "bg-slate-50/60 border-slate-200" : "bg-white"}`}
          >
            {label && (
              <legend>
                <span>
                  {label}
                  {required ? " *" : ""}
                </span>
              </legend>
            )}
          </fieldset>

          {label && (
            <label
              htmlFor={inputId}
              className={`absolute cursor-text pointer-events-none transition-all duration-200 ease-out z-10 select-none bg-transparent ${
                Icon ? "left-11" : "left-4"
              } top-3.5 text-sm text-[#8fa0b5] font-normal origin-left
              peer-focus:-top-1 peer-focus:left-3.5 peer-focus:text-xs peer-focus:font-semibold peer-focus:bg-transparent
              peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:left-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:bg-transparent
              peer-autofill:-top-1 peer-autofill:left-3.5 peer-autofill:text-xs peer-autofill:font-semibold peer-autofill:bg-transparent
              ${
                hasControlledValue
                  ? "!-top-1 !left-3.5 !text-xs !font-semibold !bg-transparent"
                  : ""
              }
              ${
                isError
                  ? "!text-red-500 peer-focus:!text-red-500 peer-[:not(:placeholder-shown)]:!text-red-500"
                  : "peer-focus:text-slate-600 peer-[:not(:placeholder-shown)]:text-slate-600"
              } ${labelClassName}`}
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}

          {rightElement && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10">
              {rightElement}
            </div>
          )}

          {children}
        </div>

        {errorMessage && (
          <p className="text-red-500 text-xs font-normal mt-1.5 pl-1 flex items-center gap-1 animate-slide-down">
            <span>{errorMessage}</span>
          </p>
        )}
        {!errorMessage && helperText && (
          <p className="text-slate-500 text-xs font-normal mt-1 pl-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";

/**
 * FloatingSelect Component
 * Integrates CustomSearch with transparent floating label, notched outline, and 3D bottom depth accent.
 */
export const FloatingSelect = forwardRef(
  (
    {
      id,
      name,
      label,
      options = [],
      placeholder = "Select Option",
      error,
      helperText,
      required = false,
      className = "",
      containerClassName = "",
      labelClassName = "",
      icon: Icon,
      disabled = false,
      selectedValue,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      children,
      isSearchable,
      ...props
    },
    ref
  ) => {
    const selectId = id || name;
    const isError = Boolean(error);
    const errorMessage = typeof error === "object" ? error?.message : error;

    return (
      <div className={`w-full ${containerClassName}`}>
        <div className="relative group floating-group is-floated">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-[#4bb7ff] transition-colors z-10">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <CustomSearch
            ref={ref}
            id={selectId}
            name={name}
            disabled={disabled}
            selectedValue={selectedValue}
            value={value !== undefined ? value : defaultValue}
            options={options}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            isSearchable={isSearchable}
            className={`!border-0 !shadow-none !bg-transparent !outline-none ${
              Icon ? "!pl-11" : ""
            } ${className}`}
            {...props}
          >
            {children}
          </CustomSearch>

          {/* Notched Outline Fieldset (Cuts top border to exact label text width + applies 3D bottom depth) */}
          <fieldset
            aria-hidden="true"
            className={`notched-outline transition-all duration-200 ${
              isError
                ? "border-red-500 shadow-[0_3px_0_0_#ef4444]"
                : "border-slate-200/90 group-hover:border-slate-300 group-focus-within:border-[#4bb7ff] group-focus-within:shadow-[0_3px_0_0_#4bb7ff]"
            } ${disabled ? "bg-slate-50/60 border-slate-200" : "bg-white"}`}
          >
            {label && (
              <legend>
                <span>
                  {label}
                  {required ? " *" : ""}
                </span>
              </legend>
            )}
          </fieldset>

          {label && (
            <label
              htmlFor={selectId}
              className={`absolute cursor-pointer pointer-events-none transition-all duration-200 ease-out z-10 select-none -top-1 left-3.5 text-xs font-semibold bg-transparent ${
                isError
                  ? "!text-red-500"
                  : "text-slate-600 group-focus-within:text-slate-600"
              } ${labelClassName}`}
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
        </div>

        {errorMessage && (
          <p className="text-red-500 text-xs font-normal mt-1.5 pl-1 flex items-center gap-1 animate-slide-down">
            <span>{errorMessage}</span>
          </p>
        )}
        {!errorMessage && helperText && (
          <p className="text-slate-500 text-xs font-normal mt-1 pl-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
FloatingSelect.displayName = "FloatingSelect";

/**
 * FloatingTextarea Component
 * Textarea with transparent floating label, notched outline, and 3D bottom depth accent.
 */
export const FloatingTextarea = forwardRef(
  (
    {
      id,
      name,
      label,
      placeholder = " ",
      rows = 3,
      error,
      helperText,
      required = false,
      className = "",
      containerClassName = "",
      labelClassName = "",
      disabled = false,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const textareaId = id || name;
    const [isFocused, setIsFocused] = useState(false);
    const hasControlledValue =
      value !== undefined && value !== null && String(value).length > 0;
    const isError = Boolean(error);
    const errorMessage = typeof error === "object" ? error?.message : error;

    return (
      <div className={`w-full ${containerClassName}`}>
        <div
          className={`relative group floating-group ${
            hasControlledValue || isFocused ? "is-floated" : ""
          }`}
        >
          <textarea
            ref={ref}
            id={textareaId}
            name={name}
            rows={rows}
            placeholder={placeholder || " "}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            onFocus={(e) => {
              setIsFocused(true);
              if (onFocus) onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              if (onBlur) onBlur(e);
            }}
            className={`peer w-full px-4 py-3.5 text-sm bg-transparent text-slate-900 rounded-xl border-0 outline-none placeholder-transparent focus:placeholder-slate-400/50 resize-none ${
              disabled ? "text-slate-400 cursor-not-allowed" : ""
            } ${className}`}
            {...props}
          />

          {/* Notched Outline Fieldset with 3D bottom depth accent */}
          <fieldset
            aria-hidden="true"
            className={`notched-outline transition-all duration-200 ${
              isError
                ? "border-red-500 shadow-[0_3px_0_0_#ef4444]"
                : "border-slate-200/90 group-hover:border-slate-300 group-focus-within:border-[#4bb7ff] group-focus-within:shadow-[0_3px_0_0_#4bb7ff]"
            } ${disabled ? "bg-slate-50/60 border-slate-200" : "bg-white"}`}
          >
            {label && (
              <legend>
                <span>
                  {label}
                  {required ? " *" : ""}
                </span>
              </legend>
            )}
          </fieldset>

          {label && (
            <label
              htmlFor={textareaId}
              className={`absolute cursor-text pointer-events-none transition-all duration-200 ease-out z-10 select-none bg-transparent left-4 top-3.5 text-sm text-[#8fa0b5] font-normal origin-left 
              peer-focus:-top-1 peer-focus:left-3.5 peer-focus:text-xs peer-focus:font-semibold peer-focus:bg-transparent
              peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:left-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:bg-transparent
              peer-autofill:-top-1 peer-autofill:left-3.5 peer-autofill:text-xs peer-autofill:font-semibold peer-autofill:bg-transparent
              ${
                hasControlledValue
                  ? "!-top-1 !left-3.5 !text-xs !font-semibold !bg-transparent"
                  : ""
              }
              ${
                isError
                  ? "!text-red-500 peer-focus:!text-red-500 peer-[:not(:placeholder-shown)]:!text-red-500"
                  : "peer-focus:text-slate-600 peer-[:not(:placeholder-shown)]:text-slate-600"
              } ${labelClassName}`}
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
        </div>

        {errorMessage && (
          <p className="text-red-500 text-xs font-normal mt-1.5 pl-1 flex items-center gap-1 animate-slide-down">
            <span>{errorMessage}</span>
          </p>
        )}
        {!errorMessage && helperText && (
          <p className="text-slate-500 text-xs font-normal mt-1 pl-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
FloatingTextarea.displayName = "FloatingTextarea";

export default FloatingInput;
