import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  EqualNot,
  List,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

const ConditionOptions = [
  { id: "contains", label: "Contains", icon: <List className="w-4 h-4 text-zinc-500" /> },
  {
    id: "notcontains",
    label: "Does not contain",
    icon: <X className="w-4 h-4 text-zinc-500" />,
  },
  {
    id: "startswith",
    label: "Starts with",
    icon: <ArrowRight className="w-4 h-4 text-zinc-500" />,
  },
  {
    id: "endswith",
    label: "Ends with",
    icon: <ArrowLeft className="w-4 h-4 text-zinc-500" />,
  },
  { id: "equals", label: "Equals", icon: <Check className="w-4 h-4 text-zinc-500" /> },
  {
    id: "notequals",
    label: "Does not equal",
    icon: <EqualNot className="w-4 h-4 text-zinc-500" />,
  },
  { id: "", label: "Reset", icon: <Search className="w-4 h-4 text-zinc-500" /> },
];

interface ConditionDropdownProps {
  onConditionChange: (Condition: string,name:string) => void; // Trả về id của Condition được chọn
  className: string;
  name: string;
}

export default function ConditionDropdown({
  onConditionChange,
  className,
  name
}: ConditionDropdownProps) {
  const [selectedCondition, setSelectedCondition] = useState(
    ConditionOptions[ConditionOptions.length - 1] 
  );

  const handleSelect = (option: (typeof ConditionOptions)[0]) => {
    setSelectedCondition(option);
    onConditionChange(option.id,name); // Gửi Condition được chọn ra ngoài
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          className={className}
        >
          {selectedCondition.icon}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {ConditionOptions.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onClick={() => handleSelect(option)}
          >
            <span className="flex items-center gap-2">
              {option.icon} {option.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
