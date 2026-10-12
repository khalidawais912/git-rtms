"use client";
import { forwardRef, useEffect, useState } from "react";
import Select, {
  ActionMeta,
  GroupBase,
  MultiValue,
  SingleValue,
  StylesConfig,
} from "react-select";

import makeAnimated from "react-select/animated";

interface Props {
  options: OptionType[];
  id?: string;
  value?: OptionType | OptionType[] | null; // can be undefined for uncontrolled/react-hook-form
  onChangeSingle?: (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  onChangeMulti?: (
    newValue: MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  placeholder?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  isMulti?: boolean;
  closeMenuOnSelect?: boolean;
  singleSelectStyles?: StylesConfig<OptionType, false, GroupBase<OptionType>>;
  menuPlacement?: "auto" | "bottom" | "top";
  maxHeight?: number;
  defaultValue?: OptionType | OptionType[] | null;
  radius?: "pill" | undefined;
}

export type OptionType = { value: string; label: string };

export const defaultOption = { value: "", label: "Select" };
export const defaultNumberOption = { value: "0", label: "Select" };
export const defaultNegativeNumberOption = { value: "-1", label: "Select" };

const CustomSelect = forwardRef<any, Props>(
  (
    {
      options,
      id,
      value,
      onChangeSingle,
      onChangeMulti,
      placeholder = "Select...",
      isClearable = false,
      isSearchable = true,
      isDisabled = false,
      isMulti = false,
      closeMenuOnSelect = false,
      singleSelectStyles,
      menuPlacement = "auto",
      maxHeight = 43 * 6,
      defaultValue,
      radius = undefined,
    },
    ref
  ) => {
    const [menuPortalTarget, setMenuPortalTarget] =
      useState<HTMLElement | null>(null);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
      setMenuPortalTarget(document.body);
    }, []);

    // Custom Single Select Style
    const customSingleSelectStyles: StylesConfig<
      OptionType,
      false,
      GroupBase<OptionType>
    > = {
      control: (base, state) => ({
        ...base,
        "::-webkit-scrollbar": {
          width: "8px", // Narrower scrollbar
          height: "8px",
        },
        "::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#22a3bd",
          borderRadius: "10px",
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "#108fa8",
        },
        background: "rgba(255, 255, 255, 0.8)",
        borderRadius: radius ? 50 : 7,
        color: "#545861",
        fontWeight: 500,
        fontSize: "14px",
        border: "none",
        boxShadow: state.isFocused
          ? "0 0 0 1.5px #0C8CE9" // focus glow
          : "0 0 0 1.5px #eff0f2",
        transition: "all 0.3s",
      }),
      dropdownIndicator: (base) => ({
        ...base,
        padding: 10.5,
      }),
      indicatorSeparator: (base) => ({
        ...base,
        display: "none", // remove vertical line if needed
      }),
      clearIndicator: (base) => ({
        ...base,
        padding: 4,
      }),
      valueContainer: (base) => ({
        ...base,
        padding: "0 6px",
      }),
      input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
      }),
      menu: (base) => ({
        ...base,
        zIndex: 9999,
        padding: "4px 8px",
        borderRadius: 14,
        border: 0,
        boxShadow: "0px 0px 7px 3px rgba(0,0,0,0.1)",
      }),
      menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? "#C2E7E4" // selected background color
          : state.isFocused
          ? "#E4EDEC" // hover background color
          : "white",
        color: "#333",
        fontSize: "14px",
        padding: "10px",
        borderRadius: 7,
      }),
      // Styles for the dropdown menu list (this is where scrollbar lives)
      menuList: (base) => ({
        ...base,
        maxHeight: maxHeight, // show 6 options, then scroll
        "::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#22a3bd",
          borderRadius: "10px",
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "#108fa8",
        },
      }),
    };

    // Custom styles for react-select multi selection options
    const customMultiSelectStyles: StylesConfig<
      OptionType,
      true,
      GroupBase<OptionType>
    > = {
      control: (base, state) => ({
        ...base,
        "::-webkit-scrollbar": {
          width: "8px", // Narrower scrollbar
          height: "8px",
        },
        "::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#22a3bd",
          borderRadius: "10px",
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "#108fa8",
        },
        fontSize: "14px",
        borderRadius: 7,
        background: "rgba(255, 255, 255, 0.8)",
        border: state.isFocused
          ? "1px solid #0c8ce9" // border on focus
          : "1px solid #eff0f2", // default border
        boxShadow: state.isFocused
          ? "0 0 0 1px rgba(12, 140, 233, 0.4)" // focus glow
          : "none",
        "&:hover": {
          border: "1px solid #0c8ce9", // hover border color
          boxShadow: "0 0 0 1px rgba(12, 140, 233, 0.4)", // hover glow
        },
      }),
      singleValue: (base) => ({
        ...base,
        color: "#1C6BA6", // ✅ selected value text
      }),
      dropdownIndicator: (base) => ({
        ...base,
        padding: 10.5,
      }),
      indicatorSeparator: (base) => ({
        ...base,
        display: "none", // remove vertical line if needed
      }),
      clearIndicator: (base) => ({
        ...base,
        padding: 4,
      }),
      valueContainer: (base) => ({
        ...base,
        padding: "0 6px",
      }),
      input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
      }),
      menu: (base) => ({
        ...base,
        zIndex: 9999,
        padding: "4px 8px",
        borderRadius: 14,
        border: 0,
        boxShadow: "0px 0px 7px 3px rgba(0,0,0,0.1)",
      }),
      menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "#E4EDEC" : "white",
        color: "#333",
        fontSize: "14px",
        padding: "10px",
        borderRadius: 7,
      }),
      // Styles for the dropdown menu list (this is where scrollbar lives)
      menuList: (base) => ({
        ...base,
        maxHeight: maxHeight, // show 6 options, then scroll
        "::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#22a3bd",
          borderRadius: "10px",
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "#108fa8",
        },
      }),
      multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: "#B0E0E6", // Light blue for selected values
      }),
    };

    const animatedComponents = makeAnimated();

    return singleSelectStyles ? (
      <Select
        options={options}
        name={id}
        id={id}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        placeholder={placeholder}
        styles={singleSelectStyles}
        menuPlacement={menuPlacement}
        menuPosition="absolute"
        closeMenuOnSelect={closeMenuOnSelect}
        components={animatedComponents}
        menuPortalTarget={menuPortalTarget}
        value={value}
        onChange={onChangeSingle}
        onFocus={() => setIsClicked(true)}
        onBlur={() => setIsClicked(false)}
        defaultValue={defaultValue}
      />
    ) : isMulti ? (
      <Select
        options={options}
        name={id}
        id={id}
        isMulti={isMulti}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        placeholder={placeholder}
        styles={customMultiSelectStyles}
        menuPlacement={menuPlacement}
        menuPosition="absolute"
        closeMenuOnSelect={closeMenuOnSelect}
        components={animatedComponents}
        menuPortalTarget={menuPortalTarget}
        value={value}
        onChange={onChangeMulti}
        onFocus={() => setIsClicked(true)}
        onBlur={() => setIsClicked(false)}
        defaultValue={defaultValue}
      />
    ) : (
      <Select
        options={options}
        name={id}
        id={id}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        placeholder={placeholder}
        styles={customSingleSelectStyles}
        menuPlacement={menuPlacement}
        menuPosition="absolute"
        closeMenuOnSelect={closeMenuOnSelect}
        menuPortalTarget={menuPortalTarget}
        value={value}
        onChange={onChangeSingle}
        onFocus={() => setIsClicked(true)}
        onBlur={() => setIsClicked(false)}
        defaultValue={defaultValue}
      />
    );
  }
);

CustomSelect.displayName = "CustomSelect";

export default CustomSelect;
