"use client";
import Select, { ActionMeta, SingleValue } from "react-select";

interface Option {
  value: string | number;
  label: string;
}

interface Props<T extends Record<string, string | number>> {
  data: T[];
  value: Option | null;
  label: keyof T;
  valueKey: keyof T;
  name: string;
  id: string;
  onChange: (
    newValue: SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => void | undefined;
  isClearable?: boolean;
}

const SearchableSingleSelect = <T extends Record<string, string | number>>({
  data,
  value,
  label,
  name,
  id,
  onChange,
  valueKey,
  isClearable = true,
}: Props<T>) => {
  const defaultOption = { value: "", label: "Select" };

  const options: Option[] = [
    defaultOption,
    ...data.map((d) => ({
      value: d[valueKey],
      label: String(d[label]),
    })),
  ];

  return (
    <Select
      id={id}
      name={name}
      options={options}
      value={value}
      isSearchable={true}
      isClearable={isClearable}
      defaultValue={defaultOption}
      onChange={onChange}
      className="basic-single"
      classNamePrefix="select"
      menuPlacement="auto"
      menuPosition="absolute"
      menuPortalTarget={document.body}
      styles={{
        menu: (provided) => ({
          ...provided,
          zIndex: 9999,
        }),
      }}
    />
  );
};

export default SearchableSingleSelect;
