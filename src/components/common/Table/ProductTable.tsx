import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { IProduct } from "@/models/interfaces";

interface ProductTableProps {
  products: IProduct[];
  filters: { [key: string]: string };
  onFilterChange: (key: keyof IProduct, value: string) => void;
}

export default function ProductTable({ products, filters, onFilterChange }: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Hình ảnh</TableHead>
          <TableHead>Tên sản phẩm</TableHead>
          <TableHead>Mã</TableHead>
          <TableHead>Danh mục</TableHead>
          <TableHead>Đơn vị</TableHead>
          <TableHead>VAT</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Giảm giá</TableHead>
          <TableHead>Bảo hành</TableHead>
          <TableHead>Ngày tạo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Ô tìm kiếm (bỏ ID, Hình ảnh, Ngày tạo) */}
        <TableRow>
          <TableCell />
          <TableCell />
          {["name", "code", "category", "unit", "vat", "status", "discountType", "warranty"].map((key) => (
            <TableCell key={key}>
              <Input
                placeholder={`Tìm ${key}`}
                value={filters[key] || ""}
                onChange={(e) => onFilterChange(key as keyof IProduct, e.target.value)}
                className="h-8 w-full"
              />
            </TableCell>
          ))}
          <TableCell />
        </TableRow>
        {/* Hiển thị dữ liệu */}
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.id}</TableCell>
            <TableCell>
              <img src={product.image} alt={product.name} className="w-10 h-10" />
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.code}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.unit}</TableCell>
            <TableCell>{product.vat}</TableCell>
            <TableCell>{product.status}</TableCell>
            <TableCell>{product.discountType}</TableCell>
            <TableCell>{product.warranty}</TableCell>
            <TableCell>{product.createdAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
