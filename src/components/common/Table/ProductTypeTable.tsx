import ConditionDropdown from "@/components/common/ConditionDropdown";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EFieldByValue, ESortOrderValue } from "@/models/enums/option";
import { IProductType, ISortOrder } from "@/models/interfaces";
import Edit from "@/pages/ProductManagement/ProductType/Edit";
import { useState } from "react";

interface FilterSearch {
  field: string;
  condition: string;
  value: string;
}

interface ProductTableProps {
  productTypes: IProductType[];
  filters: FilterSearch[];
  onFilterChange: (filters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IProductType>) => void;
}

export default function ProductTypeTable({
  productTypes,
  filters,
  onFilterChange,
}: ProductTableProps) {
  const [sortOrder, setSortOrder] = useState<ISortOrder<IProductType>>({
      sort: "",
      order: ESortOrderValue.ASC,
    });
  const onConfirmDelete = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Xóa dữ liệu thành công");
        resolve();
      }, 1000);
    });
  };

  const updateFilter = (field: string, condition: string, value: string) => {
    const updatedFilters = filters.map((f) =>
      f.field === field ? { ...f, condition, value } : f
    );

    if (!filters.some((f) => f.field === field)) {
      updatedFilters.push({ field, condition, value });
    }

    onFilterChange(updatedFilters);
  };

  const handleConditionChange = (condition: string, name: string) => {
    updateFilter(name, condition, "");
  };

  const handleSortOrder = (field: keyof IProductType) => {
    setSortOrder((prev) => ({
      sort: prev.sort === field ? "" : field, // Nếu đang sort field này thì bỏ sort
      order:
        prev.sort === field
          ? prev.order === ESortOrderValue.ASC
            ? ESortOrderValue.DESC
            : ESortOrderValue.ASC
          : ESortOrderValue.ASC,
    }));
  };
  

  const handleSortOrder = (field: keyof IProductType) => {
    setSortOrder((prev) => ({
      sort: prev.sort === field ? "" : field, // Nếu đang sort field này thì bỏ sort
      order:
        prev.sort === field
          ? prev.order === ESortOrderValue.ASC
            ? ESortOrderValue.DESC
            : ESortOrderValue.ASC
          : ESortOrderValue.ASC,
    }));
  };
  

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={()=>handleSortOrder("ID")}>ID </TableHead>
          <TableHead>Hình ảnh</TableHead>
          <TableHead>Tên sản phẩm</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead>Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Ô tìm kiếm */}
        <TableRow>
          <TableCell />
          <TableCell />
          <TableCell className="relative">
            <ConditionDropdown
              className="absolute left-5 top-1/2 transform -translate-y-1/2"
              onConditionChange={handleConditionChange}
              name="ten"
            />
            <Input
              type="search"
              placeholder="Tìm tên sản phẩm"
              value={filters.find((f) => f.field === "ten")?.value || ""}
              onChange={(e) =>
                updateFilter(
                  "ten",
                  filters.find((f) => f.field === "ten")?.condition ||
                    "contains",
                  e.target.value
                )
              }
              className="w-full rounded-md border border-stroke bg-transparent py-3 pl-10 pr-4 text-black outline-none focus:border-primary focus-visible:shadow-none"
            />
          </TableCell>
          <TableCell />
        </TableRow>
        {/* Hiển thị dữ liệu */}
        {productTypes.map((productType) => (
          <TableRow key={productType.id}>
            <TableCell>{productType.id}</TableCell>
            <TableCell>
              <img
                src={`http://192.168.0.121:8000/public/images/${productType.hinh_anh}`}
                alt={productType.ten}
                className="w-10 h-10"
              />
            </TableCell>
            <TableCell>{productType.ten}</TableCell>
            <TableCell>{productType.created_at}</TableCell>
            <TableCell className="flex space-x-2">
              <Edit productType={productType} />
              <ConfirmDeleteButton
                onConfirm={onConfirmDelete}
                title={`Bạn có chắc chắn muốn xóa sản phẩm ${productType.ten}?`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
