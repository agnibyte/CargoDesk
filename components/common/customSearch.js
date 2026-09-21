"use client";

import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { FiSearch, FiChevronDown, FiCheck, FiX } from "react-icons/fi";

// Harmonious palette of gradients for initial avatar badges
const BADGE_GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-cyan-600 to-blue-600",
  "from-emerald-600 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-purple-600 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-violet-600 to-purple-600",
  "from-teal-500 to-emerald-600",
];

function getInitials(text) {
  if (!text) return "";
  const cleaned = String(text).replace(/[^a-zA-Z0-9\s]/g, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return String(text).substring(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getGradientIndex(str) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % BADGE_GRADIENTS.length;
}

/**
 * Creates a synthetic event object compatible with:
 * 1. React Hook Form ({ target: { name, value } })
 * 2. Standard DOM event handlers (e.target.value)
 * 3. Custom select handlers expecting option object (e.value, e.label)
 */
function createSyntheticEvent(eventType, val, label, rawOpt, inputName, inputId) {
  const strVal = val !== undefined && val !== null ? String(val) : "";
  const strLabel = label !== undefined && label !== null ? String(label) : strVal;
  const nameAttr = inputName || inputId || "";

  const targetObj = {
    name: nameAttr,
    id: inputId || "",
    value: strVal,
    type: "select-one",
  };

  const isObj = typeof rawOpt === "object" && rawOpt !== null && !Array.isArray(rawOpt);
  const extraProps = isObj ? rawOpt : {};

  return {
    type: eventType,
    target: targetObj,
    currentTarget: targetObj,
    value: strVal,
    label: strLabel,
    name: nameAttr,
    ...extraProps,
    preventDefault: () => {},
    stopPropagation: () => {},
  };
}

const CustomSearch = forwardRef(
  (
    {
      selectedValue,
      value,
      defaultValue,
      options = [],
      onChange,
      onFocus,
      onBlur,
      placeholder = "Select Option",
      className = "",
      disabled = false,
      name,
      id,
      isSearchable = true,
      allowClear = true,
      children,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);
    const listRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    // Initial value resolution
    const initialRawVal =
      selectedValue !== undefined
        ? selectedValue
        : value !== undefined
        ? value
        : defaultValue !== undefined
        ? defaultValue
        : "";

    const initialVal =
      initialRawVal && typeof initialRawVal === "object"
        ? String(initialRawVal.value ?? "")
        : initialRawVal !== undefined && initialRawVal !== null
        ? String(initialRawVal)
        : "";

    const [internalValue, setInternalValue] = useState(initialVal);

    // Sync internal value whenever parent passes controlled value/selectedValue
    useEffect(() => {
      if (selectedValue !== undefined) {
        const val =
          selectedValue && typeof selectedValue === "object"
            ? String(selectedValue.value ?? "")
            : selectedValue !== null && selectedValue !== undefined
            ? String(selectedValue)
            : "";
        setInternalValue(val);
      } else if (value !== undefined) {
        const val =
          value && typeof value === "object"
            ? String(value.value ?? "")
            : value !== null && value !== undefined
            ? String(value)
            : "";
        setInternalValue(val);
      }
    }, [selectedValue, value]);

    // Forward ref to hidden input
    useEffect(() => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(inputRef.current);
      } else if (typeof ref === "object") {
        ref.current = inputRef.current;
      }
    }, [ref]);

    const currentValue = internalValue;

    // Normalize options into uniform array
    const normalizedOptions = useMemo(() => {
      return (options || []).map((opt, index) => {
        const isObj = typeof opt === "object" && opt !== null;
        const optVal = isObj ? String(opt.value ?? "") : String(opt ?? "");
        const optLabel = isObj ? String(opt.label ?? opt.value ?? "") : String(opt ?? "");
        const isDisabled = isObj ? Boolean(opt.isDisabled) : false;
        const initial = getInitials(optLabel || optVal);
        const gradient = BADGE_GRADIENTS[getGradientIndex(optLabel || optVal)];

        return {
          id: isObj && opt.id ? opt.id : `${optVal}-${index}`,
          value: optVal,
          label: optLabel,
          initial,
          gradient,
          isDisabled,
          raw: opt,
        };
      });
    }, [options]);

    // Find currently selected option object
    const selectedOption = useMemo(() => {
      return (
        normalizedOptions.find((opt) => opt.value === currentValue) ||
        (currentValue
          ? {
              value: currentValue,
              label: currentValue,
              initial: getInitials(currentValue),
              gradient: BADGE_GRADIENTS[getGradientIndex(currentValue)],
              raw: currentValue,
            }
          : null)
      );
    }, [normalizedOptions, currentValue]);

    // Filter options by search query (initials, starts-with, substring matching)
    const filteredOptions = useMemo(() => {
      if (!searchQuery.trim()) return normalizedOptions;
      const q = searchQuery.toLowerCase().trim();

      return normalizedOptions.filter((opt) => {
        const label = opt.label.toLowerCase();
        const val = opt.value.toLowerCase();
        const initial = opt.initial.toLowerCase();

        // 1. Initial match (e.g. "rk" matches "Ramesh Kumar")
        if (initial.startsWith(q) || initial === q) return true;
        // 2. Starts with search query
        if (label.startsWith(q) || val.startsWith(q)) return true;
        // 3. Substring match
        if (label.includes(q) || val.includes(q)) return true;

        // 4. Match initials of words (e.g. "mh" for "MH 04 EF 9101")
        const words = label.split(/\s+/);
        const initials = words.map((w) => w[0]).join("");
        if (initials.includes(q)) return true;

        return false;
      });
    }, [normalizedOptions, searchQuery]);

    // Handle selection
    const handleSelect = useCallback(
      (opt) => {
        if (!opt || opt.isDisabled) return;
        const optVal = opt.value;
        const optLabel = opt.label;

        setInternalValue(optVal);

        if (inputRef.current) {
          inputRef.current.value = optVal;
        }

        if (onChange) {
          const event = createSyntheticEvent(
            "change",
            optVal,
            optLabel,
            opt.raw,
            name,
            id
          );
          onChange(event);
        }

        setIsOpen(false);
        setSearchQuery("");

        if (onBlur) {
          const blurEvent = createSyntheticEvent(
            "blur",
            optVal,
            optLabel,
            opt.raw,
            name,
            id
          );
          onBlur(blurEvent);
        }
      },
      [onChange, onBlur, name, id]
    );

    // Handle clearing
    const handleClear = useCallback(
      (e) => {
        if (e && e.stopPropagation) {
          e.stopPropagation();
        }
        setInternalValue("");

        if (inputRef.current) {
          inputRef.current.value = "";
        }

        if (onChange) {
          const event = createSyntheticEvent(
            "change",
            "",
            "",
            null,
            name,
            id
          );
          onChange(event);
        }

        setIsOpen(false);
        setSearchQuery("");

        if (onBlur) {
          const blurEvent = createSyntheticEvent(
            "blur",
            "",
            "",
            null,
            name,
            id
          );
          onBlur(blurEvent);
        }
      },
      [onChange, onBlur, name, id]
    );

    // Toggle dropdown
    const toggleDropdown = () => {
      if (disabled) return;
      const willOpen = !isOpen;
      setIsOpen(willOpen);

      if (willOpen) {
        setSearchQuery("");
        setHighlightedIndex(0);
        if (onFocus) {
          const focusEvent = createSyntheticEvent(
            "focus",
            currentValue,
            selectedOption?.label,
            selectedOption?.raw,
            name,
            id
          );
          onFocus(focusEvent);
        }
      } else {
        if (onBlur) {
          const blurEvent = createSyntheticEvent(
            "blur",
            currentValue,
            selectedOption?.label,
            selectedOption?.raw,
            name,
            id
          );
          onBlur(blurEvent);
        }
      }
    };

    // Close on click outside
    useEffect(() => {
      function handleClickOutside(e) {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          if (isOpen) {
            setIsOpen(false);
            setSearchQuery("");
            if (onBlur) {
              const blurEvent = createSyntheticEvent(
                "blur",
                currentValue,
                selectedOption?.label,
                selectedOption?.raw,
                name,
                id
              );
              onBlur(blurEvent);
            }
          }
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, currentValue, selectedOption, onBlur, name, id]);

    // Autofocus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen]);

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (disabled) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (isOpen && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        } else {
          setIsOpen(true);
        }
      } else if (e.key === "Escape" || e.key === "Tab") {
        if (isOpen) {
          setIsOpen(false);
          if (onBlur) {
            const blurEvent = createSyntheticEvent(
              "blur",
              currentValue,
              selectedOption?.label,
              selectedOption?.raw,
              name,
              id
            );
            onBlur(blurEvent);
          }
        }
      }
    };

    // Scroll highlighted option into view
    useEffect(() => {
      if (isOpen && listRef.current) {
        const activeElement = listRef.current.children[highlightedIndex];
        if (activeElement) {
          activeElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }
    }, [highlightedIndex, isOpen]);

    return (
      <div
        ref={containerRef}
        className={`relative w-full text-left select-none ${
          disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : ""
        }`}
        onKeyDown={handleKeyDown}
      >
        {/* Hidden Input for Form Submission / RHF */}
        <input
          ref={inputRef}
          type="hidden"
          name={name}
          id={id}
          value={currentValue}
          readOnly
        />

        {/* Dropdown Trigger Display Box */}
        <div
          onClick={toggleDropdown}
          tabIndex={disabled ? -1 : 0}
          className={`w-full min-h-[48px] px-3.5 py-2.5 flex items-center justify-between gap-2 bg-white text-slate-900 rounded-xl cursor-pointer transition-all duration-200 ${className}`}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {selectedOption && selectedOption.value ? (
              <>
                <div
                  className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${selectedOption.gradient} text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs`}
                >
                  {selectedOption.initial}
                </div>
                <span className="text-sm font-semibold text-slate-800 truncate">
                  {selectedOption.label}
                </span>
              </>
            ) : (
              <span className="text-sm font-normal text-[#8fa0b5] truncate">
                {placeholder}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {allowClear && selectedOption && selectedOption.value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Clear selection"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}

            <div
              className={`text-slate-400 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-blue-500" : ""
              }`}
            >
              <FiChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Dropdown Popover Menu with Live Search */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 overflow-hidden animate-slide-down">
            {/* Search Input Box */}
            {isSearchable && (
              <div className="p-2.5 border-b border-slate-100 bg-slate-50/70">
                <div className="relative flex items-center">
                  <FiSearch className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    placeholder="Search by name, initial, or code..."
                    className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all placeholder:text-slate-400 font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-700 rounded-md"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              ref={listRef}
              className="max-h-60 overflow-y-auto p-1.5 space-y-0.5"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, index) => {
                  const isSelected = opt.value === currentValue;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelect(opt)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-xs sm:text-sm font-medium ${
                        opt.isDisabled
                          ? "opacity-40 cursor-not-allowed bg-transparent"
                          : isSelected
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : isHighlighted
                          ? "bg-slate-100/90 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${opt.gradient} text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs`}
                        >
                          {opt.initial}
                        </div>
                        <span className="truncate">{opt.label}</span>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2">
                          <FiCheck className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    No results found for &ldquo;<span className="font-semibold text-slate-700">{searchQuery}</span>&rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold mt-1.5"
                  >
                    Clear search filter
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

CustomSearch.displayName = "CustomSearch";

export default CustomSearch;
