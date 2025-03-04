import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import {
  AlignHorizontalSpaceAround,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Equal,
  EqualNot,
  List,
  ListCollapse,
  Search,
  X
} from "lucide-react";
import { useState } from "react";

const ConditionTextOptions = [
  {  id: "contains", label: "Contains", icon: <List className="w-4 h-4 text-zinc-500" /> },
  { id: "notcontains", label: "Does not contain", icon: <X className="w-4 h-4 text-zinc-500" /> },
  { id: "startswith", label: "Starts with", icon: <ArrowRight className="w-4 h-4 text-zinc-500" /> },
  { id: "endswith", label: "Ends with", icon: <ArrowLeft className="w-4 h-4 text-zinc-500" /> },
  { id: "=", label: "Equals", icon: <Equal className="w-4 h-4 text-zinc-500" /> },
  { id: "<>", label: "Does not equal", icon: <EqualNot className="w-4 h-4 text-zinc-500" /> },
  { id: "contains", label: "Reset", icon: <Search className="w-4 h-4 text-zinc-500" /> },
];

const ConditionNumberOptions = [
  { id: "=", label: "Equals", icon: <Equal className="w-4 h-4 text-zinc-500" /> },
  { id: "<>", label: "Does not equal", icon: <EqualNot className="w-4 h-4 text-zinc-500" /> },
  { id: "<", label: "Less than", icon: <ChevronLeft className="w-4 h-4 text-zinc-500" /> },
  { id: ">", label: "Greater than", icon: <ChevronRight className="w-4 h-4 text-zinc-500" /> },
  { id: "<=", label: "Less than or equal to", icon: <ListCollapse className="w-4 h-4 text-zinc-500 rotate-180" /> },
  { id: ">=", label: "Greater than or equal to", icon: <ListCollapse className="w-4 h-4 text-zinc-500" /> },
  { id: "between", label: "Between", icon: <AlignHorizontalSpaceAround className="w-4 h-4 text-zinc-500" /> },
  { id: "contains", label: "Reset", icon: <X className="w-4 h-4 text-zinc-500" /> },
];

interface ConditionDropdownProps {
  onConditionChange: (condition: string, name: string) => void;
  className: string;
  name: string;
  type: "text" | "number";
}

export default function ConditionDropdown({
  onConditionChange,
  className,
  name,
  type,
}: ConditionDropdownProps) {
  const conditionOptions = type === "text" ? ConditionTextOptions : ConditionNumberOptions;

  const [selectedCondition, setSelectedCondition] = useState(conditionOptions[conditionOptions.length - 1]);

  const handleSelect = (option: (typeof conditionOptions)[0]) => {
    setSelectedCondition(option);
    onConditionChange(option.id, name);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer ">
        <span className={clsx(className,'')}>{selectedCondition.icon}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full">
        {conditionOptions.map((option) => (
          <DropdownMenuItem key={option.label} onClick={() => handleSelect(option)}>
            <span className="flex items-center gap-2">
              {option.icon} {option.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
