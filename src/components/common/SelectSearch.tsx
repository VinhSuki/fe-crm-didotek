/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface SelectSearchProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  options: { ID: number | string; ten: string }[];
}

const SelectSearch = ({
  form,
  name,
  label,
  placeholder,
  options,
}: SelectSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((v) =>
    v.ten.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={field.onChange}
            value={String(field.value || "")}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || "Chọn một giá trị"} />
              </SelectTrigger>
            </FormControl>
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectSearch;
