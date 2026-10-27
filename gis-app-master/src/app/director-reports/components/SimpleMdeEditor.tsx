import { useCallback, useMemo, useState } from "react";
import SimpleMdeReact from "react-simplemde-editor";
import type { Options } from "easymde"; // ✅ Import the correct type

export const SimpleMdeEditor = () => {
  const [value, setValue] = useState("Initial");

  const onChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  const autofocusNoSpellcheckerOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
    } as Options;
  }, []);

  return (
    <SimpleMdeReact
      options={autofocusNoSpellcheckerOptions}
      value={value}
      onChange={onChange}
    />
  );
};
