/* eslint-disable @typescript-eslint/no-explicit-any */
import ConditionDropdown from "@/components/common/ConditionDropdown";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/hooks/useDebounce";
import { ESortOrderValue } from "@/models/enums/option";
import { Column, FilterSearch, ISortOrder } from "@/models/interfaces";
import { convertRFC1123 } from "@/utils/convertRFC1123";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface IBetweenCondition {
  minValue: string;
  maxValue: string;
}

interface IBetweenCondition {
  minValue: string;
  maxValue: string;
}

interface GenericTableProps<T> {
  filters: FilterSearch[];
  sortOrder: ISortOrder<T>;
  data: T[];
  columns: Column<T>[];
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<T>) => void;
  actions?: (row: T) => React.ReactNode;
}

export default function GenericTable<T>({
  data,
  columns,
  onFilterChange,
  onSortOrder,
  actions,
  filters,
  sortOrder,
}: GenericTableProps<T>) {
  const [fieldBetween, setFieldBetween] = useState<string[]>([]);
  const [searchValues, setSearchValues] = useState(() => {
    return columns.reduce((acc, { key, searchCondition }) => {
      if (searchCondition) {
        acc[String(key)] = { minValue: "", maxValue: "", value: "" };
      }
      return acc;
    }, {} as Record<string, { minValue: string; maxValue: string; value: string }>);
  });

  const updateFilter = useCallback(
    async (
      field: string,
      condition: string,
      value: string,
      betweenValue: IBetweenCondition = { minValue: "", maxValue: "" }
    ) => {
      let updatedFilters = filters;

      updatedFilters = filters.filter((f) => f.field !== field);
      if (condition !== "between") {
        updatedFilters = [...updatedFilters, { field, condition, value }];
      } else {
        updatedFilters = [
          ...updatedFilters,
          {
            field,
            condition: ">=",
            value: String(betweenValue.minValue ?? ""),
          },
          {
            field,
            condition: "<=",
            value: String(betweenValue.maxValue ?? ""),
          },
        ];
      }

      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange]
  );

  const debouncedSearchValues = useDebounce(searchValues, 500);

  useEffect(() => {
    const isAllEmpty = Object.keys(debouncedSearchValues).every(
      (key) =>
        !debouncedSearchValues[key as keyof typeof debouncedSearchValues]?.value
    );
    if (isAllEmpty) {
      if (filters.length > 0) {
        onFilterChange([]);
      }
      return;
    }
    Object.keys(debouncedSearchValues).forEach((key) => {
      const currentFilter = filters.find((f) => f.field === key);
      const iscurrentFilterBetween = fieldBetween.some(
        (fieldBetween) => fieldBetween === key
      );
      if (iscurrentFilterBetween) {
        const newValue =
          debouncedSearchValues[key as keyof typeof debouncedSearchValues];
        if (newValue.minValue && newValue.maxValue) {
          if (
            !currentFilter ||
            currentFilter.value !== newValue.minValue ||
            currentFilter.value !== newValue.maxValue
          ) {
            updateFilter(key, "between", "", {
              minValue: newValue.minValue,
              maxValue: newValue.maxValue,
            });
          }
        }
        return;
      }
      const newValue =
        debouncedSearchValues[key as keyof typeof debouncedSearchValues];
      // Chỉ cập nhật filter nếu giá trị mới khác giá trị cũ
      if (!currentFilter || currentFilter.value !== newValue.value) {
        updateFilter(
          key,
          currentFilter?.condition || "contains",
          newValue.value
        );
      }
    });
  }, [
    debouncedSearchValues,
    filters,
    onFilterChange,
    fieldBetween,
    updateFilter,
  ]);

  const handleSearchChange = (
    field: string,
    value: { minValue: string; maxValue: string; value: string }
  ) => {
    setSearchValues((prev) => ({ ...prev, [field]: { ...value } }));
  };

  const handleConditionChange = async (condition: string, field: string) => {
    if (condition !== "between") {
      updateFilter(field, condition, "");
      setFieldBetween((prev) => prev.filter((f) => f !== field));
    } else {
      setFieldBetween((prev) => [...prev, field]);
      setSearchValues((prev) => ({
        ...prev,
        [field]: { minValue: "", maxValue: "", value: "" },
      }));
      updateFilter(field, "between", "");
    }
  };

  const handleSortOrder = (field: keyof T) => {
    sortOrder = {
      sort: field,
      order:
        sortOrder.sort === field
          ? sortOrder.order === ESortOrderValue.ASC
            ? ESortOrderValue.DESC
            : ESortOrderValue.ASC
          : ESortOrderValue.ASC,
    };
    onSortOrder(sortOrder);
  };

  const renderSortIcon = (field: keyof T) => {
    if (sortOrder.sort === field) {
      return sortOrder.order === ESortOrderValue.ASC ? (
        <ArrowUp size={16} />
      ) : (
        <ArrowDown size={16} />
      );
    }
    return null;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(({ key, label, sortName }) =>
            sortName ? (
              <TableHead
                key={String(key)}
                onClick={() => handleSortOrder(sortName)}
              >
                <div className={`flex items-center space-x-2 cursor-pointer`}>
                  <span>{label}</span> {renderSortIcon(sortName)}
                </div>
              </TableHead>
            ) : (
              <TableHead key={String(key)}>
                <div className={`flex items-center space-x-2`}>
                  <span>{label}</span>
                </div>
              </TableHead>
            )
          )}
          {actions && <TableHead>Thao tác</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Ô tìm kiếm */}
        <TableRow>
          {columns.map(({ key, searchCondition }) => (
            <TableCell key={String(key)} className="relative">
              {searchCondition && (
                <>
                  <ConditionDropdown
                    className="absolute left-5 top-1/2 transform -translate-y-1/2"
                    onConditionChange={handleConditionChange}
                    name={String(key)}
                    type={searchCondition ?? "text"}
                  />
                  {fieldBetween.some(
                    (fieldBetween) => fieldBetween === String(key)
                  ) ? (
                    <Popover>
                      <PopoverTrigger className="w-full">
                        <Input
                          readOnly={true}
                          placeholder="Nhấp để chọn khoảng giá"
                          className="w-full rounded-md border border-stroke bg-transparent py-3 pl-10 pr-4 text-black outline-none cursor-pointer"
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="p-2 space-y-2">
                          <Input
                            type="number"
                            value={searchValues[String(key)]?.minValue || ""}
                            placeholder="Từ"
                            className="w-full rounded-md border border-stroke bg-white py-3 pl-4 text-black outline-none"
                            onChange={(e) =>
                              handleSearchChange(String(key), {
                                minValue: e.target.value,
                                maxValue:
                                  searchValues[String(key)].maxValue || "",
                                value: "",
                              })
                            }
                          />
                          <Input
                            type="number"
                            value={searchValues[String(key)]?.value || ""}
                            placeholder="Đến"
                            className="w-full rounded-md border border-stroke bg-white py-3 pl-4 text-black outline-none"
                            onChange={(e) =>
                              handleSearchChange(String(key), {
                                minValue:
                                  searchValues[String(key)].minValue || "",
                                maxValue: e.target.value,
                                value: "",
                              })
                            }
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Input
                      type="search"
                      placeholder="Tìm tên sản phẩm"
                      value={searchValues[String(key)].value ?? ""}
                      onChange={(e) =>
                        handleSearchChange(String(key), {
                          minValue: "",
                          maxValue: "",
                          value: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-stroke bg-transparent py-3 pl-10 pr-4 text-black outline-none"
                    />
                  )}
                </>
              )}
            </TableCell>
          ))}
        </TableRow>
        {/* Dữ liệu */}
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map(({ key, render }) => (
              <TableCell key={String(key)}>
                {render
                  ? render(row)
                  : key === "CreatedAt"
                  ? convertRFC1123((row as any)[key])
                  : (row as any)[key]}
              </TableCell>
            ))}
            {actions && (
              <TableCell className="flex space-x-2">{actions(row)}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
