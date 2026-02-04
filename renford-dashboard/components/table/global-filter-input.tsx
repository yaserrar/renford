import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const GlobalFilterInput = ({
  value: initialValue,
  placeholder,
  onChange,
  debounce = 500,
}: {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  debounce?: number;
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <Input
        placeholder={placeholder}
        className="max-w-[300px] md:max-w-[300px] w-[600px] pl-10 bg-white border border-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
export default GlobalFilterInput;
