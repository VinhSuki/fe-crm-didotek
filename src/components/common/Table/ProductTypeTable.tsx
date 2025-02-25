import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { IProductType } from "@/models/interfaces";

interface ProductTableProps {
  productTypes: IProductType[];
  filters: { [key: string]: string };
  onFilterChange: (key: keyof IProductType, value: string) => void;
}

export default function ProductTypeTable({ productTypes, filters, onFilterChange }: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Hình ảnh</TableHead>
          <TableHead>Tên sản phẩm</TableHead>
          <TableHead>Ngày tạo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Ô tìm kiếm (bỏ ID, Hình ảnh, Ngày tạo) */}
        <TableRow>
          <TableCell />
          <TableCell />
          <TableCell>
            <Input
              placeholder="Tìm tên sản phẩm"
              value={filters.ten || ""}
              onChange={(e) => onFilterChange("ten", e.target.value)}
              className="h-8 w-full"
            />
          </TableCell>
          <TableCell />
        </TableRow>
        {/* Hiển thị dữ liệu */}
        {productTypes.map((productType) => (
          <TableRow key={productType.id}>
            <TableCell>{productType.id}</TableCell>
            <TableCell>
              <img src={productType.anh} alt={productType.ten} className="w-10 h-10" />
            </TableCell>
            <TableCell>{productType.ten}</TableCell>
            <TableCell>{productType.created_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
