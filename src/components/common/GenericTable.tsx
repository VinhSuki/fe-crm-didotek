/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ConditionDropdown from "@/components/common/ConditionDropdown";
import TableCellContent from "@/components/common/TableCellContent";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import clsx from "clsx";
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

  const updateFilters = useCallback(
    async (
      newFilters: Array<{
        field: string;
        condition: string;
        value: string;
        betweenValue?: IBetweenCondition;
      }>
    ) => {
      let updatedFilters = filters;

      // Xóa các filters cũ có cùng field với filters mới
      updatedFilters = filters.filter(
        (f) => !newFilters.some((nf) => nf.field === f.field)
      );

      // Thêm các filters mới
      newFilters.forEach(({ field, condition, value, betweenValue }) => {
        if (condition !== "between") {
          updatedFilters = [...updatedFilters, { field, condition, value }];
        } else if (betweenValue) {
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
      });

      // Gọi onFilterChange chỉ một lần
      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange]
  );

  const debouncedSearchValues = useDebounce(searchValues, 500);

  useEffect(() => {
    const isAllEmpty =
      Object.values(debouncedSearchValues).every(
        ({ minValue, maxValue, value }) => !minValue && !maxValue && !value
      ) && fieldBetween.length === 0;
    if (isAllEmpty) {
      if (filters.length > 0) {
        const updatedEmptyFilters = filters.map((f) => ({
          ...f,
          value: "",
        }));
        onFilterChange(updatedEmptyFilters);
      }
      return;
    }

    const newFilters: {
      field: string;
      condition: string;
      value: string;
      betweenValue?: IBetweenCondition;
    }[] = [];

    Object.keys(debouncedSearchValues).forEach((key) => {
      const currentFilter = filters.find((f) => f.field === key);
      const isCurrentFilterBetween = fieldBetween.includes(key);
      const newValue =
        debouncedSearchValues[key as keyof typeof debouncedSearchValues];

      if (isCurrentFilterBetween) {
        if (newValue.minValue && newValue.maxValue) {
          newFilters.push({
            field: key,
            condition: "between",
            value: "",
            betweenValue: {
              minValue: newValue.minValue,
              maxValue: newValue.maxValue,
            },
          });
        }
      } else {
        if (!currentFilter || currentFilter.value !== newValue.value) {
          newFilters.push({
            field: key,
            condition: currentFilter?.condition || "contains",
            value: newValue.value,
          });
        }
      }
    });

    if (newFilters.length > 0) {
      updateFilters(newFilters);
    }
  }, [debouncedSearchValues]);

  const handleSearchChange = (
    field: string,
    value: { minValue: string; maxValue: string; value: string }
  ) => {
    setSearchValues((prev) => ({ ...prev, [field]: { ...value } }));
  };

  const handleConditionChange = async (condition: string, field: string) => {
    if (condition !== "between") {
      const fieldValue = fieldBetween.some((f) => f === field)
        ? ""
        : filters.find((f) => f.field === field)?.value;
      updateFilters([{ field, condition, value: fieldValue ?? "" }]); // Cập nhật một lần
      setFieldBetween((prev) => prev.filter((f) => f !== field));
    } else {
      setFieldBetween((prev) => [...prev, field]);
      setSearchValues((prev) => ({
        ...prev,
        [field]: { minValue: "", maxValue: "", value: "" },
      }));

      updateFilters([
        {
          field,
          condition: "between",
          value: "",
          betweenValue: { minValue: "", maxValue: "" },
        },
      ]);
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
    <Table className="overflow-x-auto w-full">
      <TableHeader>
        <TableRow>
          {columns.map(({ key, label, sortName,minW }) =>
            sortName ? (
              <TableHead
                key={String(key)}
                onClick={() => handleSortOrder(sortName)}
                className={clsx("whitespace-nowrap",minW)}
              >
                <div className={`flex items-center space-x-2 cursor-pointer`}>
                  <span>{label}</span> {renderSortIcon(sortName)}
                </div>
              </TableHead>
            ) : (
              <TableHead key={String(key)} className={clsx("whitespace-nowrap",minW)}>
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
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
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
                          className="w-full rounded-md border border-stroke bg-transparent py-3 pl-8 pr-4 text-black outline-none cursor-pointer"
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
                            value={searchValues[String(key)]?.maxValue || ""}
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
                      value={searchValues[String(key)].value ?? ""}
                      onChange={(e) =>
                        handleSearchChange(String(key), {
                          minValue: "",
                          maxValue: "",
                          value: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-stroke bg-transparent py-3 pl-8 pr-4 text-black outline-none"
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
                {render ? (
                  render(row)
                ) : (
                  <TableCellContent
                    keyName={String(key)}
                    value={(row as any)[key]}
                  />
                )}
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
