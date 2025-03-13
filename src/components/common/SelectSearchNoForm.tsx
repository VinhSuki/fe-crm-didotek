import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface SelectSearchNoFormProps {
  label?: string;
  placeholder?: string;
  options: { ID: number | string; ten: string }[];
  value?: string | number;
  onChange: (id: string | number) => void; // Trả ra ID khi chọn
}

const SelectSearchNoForm = ({
  label,
  placeholder,
  options,
  value,
  onChange,
}: SelectSearchNoFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc các option theo từ khóa tìm kiếm
  const filteredOptions = options.filter((v) =>
    v.ten.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {label && <Label>{label}</Label>}
      <Select onValueChange={onChange} value={String(value || "")}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || "Chọn một giá trị"} />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {/* Ô tìm kiếm */}
          <div className="p-2">
            <Input
              placeholder="Tìm kiếm..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Danh sách item đã lọc */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((v) => (
              <SelectItem value={String(v.ID)} key={v.ID}>
                {v.ten}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">
              Không tìm thấy kết quả
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectSearchNoForm;
