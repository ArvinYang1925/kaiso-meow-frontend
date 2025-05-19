import { SelectOption } from "@/types/select";
import {
  Select as RadixSelect,
  SelectContent,
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
  // placeholder = "",
  value,
  onValueChange,
  className,
}) => {
  // 確保在控制台記錄值的變化，幫助調試
  const handleValueChange = (newValue: string) => {
    console.log("選擇的值:", newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <RadixSelect value={value} onValueChange={handleValueChange}>
      <SelectTrigger
        className={
          className ??
          "w-full text-start text-sm w-full border border-gray-300 bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
        }
        aria-label="選擇選項"
      >
        <SelectValue>
          {options.find((opt) => opt.value === value)?.label}
        </SelectValue>
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
                className="w-full bg-white border-b border-gray-200 px-3 py-2 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                // key={option.value}
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
