/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface SelectGroupSearchProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  options: {
    group: string;
    groupId: number | string;
    items: { ID: number | string; ten: string }[];
  }[];
}

const SelectGroupSearch = ({
  form,
  name,
  label,
  placeholder,
  options,
}: SelectGroupSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc nhóm và mục theo tìm kiếm
  const filteredOptions = options
    .map((group) => ({
      ...group,
      items: group.items.filter((v) =>
        v.ten.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0); // Chỉ giữ lại nhóm có item phù hợp

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={(value) => field.onChange(value)} // Lưu "groupId:itemId"
            value={field.value || ""}
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

              {/* Danh sách nhóm và mục đã lọc */}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((group) => (
                  <SelectGroup key={group.groupId}>
                    <SelectLabel>{group.group}</SelectLabel>
                    {group.items.map((v) => (
                      <SelectItem
                        value={`${group.groupId}:${v.ID}`} // Lưu cả groupId và itemId
                        key={v.ID}
                      >
                        {v.ten}
                      </SelectItem>
                    ))}
                  </SelectGroup>
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

export default SelectGroupSearch;
