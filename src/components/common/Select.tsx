import { useState } from "react";
import { SelectOption } from "@/types/select";
import {
  Select as RadixSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@radix-ui/react-select";

interface CustomSelectProps {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const Select: React.FC<CustomSelectProps> = ({
  options,
  value,
  onValueChange,
  className,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <RadixSelect value={selectedValue} onValueChange={handleValueChange}>
      <SelectTrigger
        className={
          className ??
          "w-full text-start text-sm w-full border border-gray-300 bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
        }
        aria-label="選擇選項"
      >
        <SelectGroup>
          <SelectValue>
            {options.find((opt) => opt.value === selectedValue)?.label}
          </SelectValue>
        </SelectGroup>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          position="popper"
          sideOffset={5}
          className="overflow-hidden bg-white border border-gray-200 rounded-md shadow-md z-50"
        >
          <SelectViewport className="p-1">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                className="w-full bg-white border-b border-gray-200 px-3 py-2 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                value={option.value}
                textValue={option.label}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </RadixSelect>
  );
};

export default Select;
