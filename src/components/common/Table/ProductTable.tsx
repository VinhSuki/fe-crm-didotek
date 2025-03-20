import productApi from "@/apis/modules/product.api";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import GenericTable from "@/components/common/GenericTable";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import {
  Column,
  FilterSearch,
  IProduct,
  ISortOrder,
} from "@/models/interfaces";
import { SquarePen } from "lucide-react";
import { useCallback } from "react";
import { Link } from "react-router-dom";

interface IProductsTableProps {
  products: IProduct[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IProduct>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IProduct>) => void;
  onDeleted: () => void;
  onEdited: () => void;
}

const columns: Column<IProduct>[] = [
  { key: "ID", sortName: "ID", label: "ID", minW: "min-w-[50px]" },
  {
    key: "hinh_anh",
    label: "Hình ảnh",
  },
  {
    key: "ten",
    label: "Tên sản phẩm",
    sortName: "ten",
    searchCondition: "text",
    minW: "min-w-[200px]",
  },
  {
    key: "upc",
    label: "Mã sản phẩm",
    sortName: "upc",
    searchCondition: "text",
    minW: "min-w-[200px]",
  },
  {
    key: "loai_san_pham",
    label: "Loại sản phẩm",
    sortName: "loai_san_pham",
    searchCondition: "text",
    minW: "min-w-[200px]",
  },
  {
    key: "don_vi_tinh",
    label: "Đơn vị tính",
    sortName: "don_vi_tinh",
    searchCondition: "text",
    minW: "min-w-[200px]",
  },
  {
    key: "vat",
    label: "VAT",
    sortName: "vat",
    searchCondition: "number",
    minW: "min-w-[100px]",
  },
  {
    key: "trang_thai",
    label: "Trạng thái",
    sortName: "trang_thai",
    searchCondition: "text",
    minW: "min-w-[200px]",
  },
  {
    key: "loai_giam_gia",
    label: "Loại giảm giá",
    sortName: "loai_giam_gia",
    searchCondition: "text",
    minW: "min-w-[200px]",
  },
  {
    key: "thoi_gian_bao_hanh",
    label: "Thời gian bảo hành",
    sortName: "thoi_gian_bao_hanh",
    searchCondition: "text",
    minW: "min-w-[200px]",
  },
  {
    key: "CreatedAt",
    sortName: "CreatedAt",
    label: "Ngày tạo",
    minW: "min-w-[200px]",
  },
];

const ProductTable = ({
  products,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
  onDeleted,
}: IProductsTableProps) => {
  const authMethod = useAuthContext();
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      // eslint-disable-next-line no-useless-catch
      try {
        await productApi.delete(id);
        onDeleted();
      } catch (error) {
        throw error;
      }
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  // console.log("re-render");
  return (
    <GenericTable<IProduct>
      data={products}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <>
          {authMethod?.checkPermission("update-san-pham") && (
            <Link to={`cap-nhat/${row.ID}`}>
              <Button className="bg-zinc-700 hover:bg-zinc-800">
                <SquarePen />
              </Button>
            </Link>
          )}
          {authMethod?.checkPermission("delete-san-pham") && (
            <ConfirmDeleteButton
              id={row.ID}
              onConfirm={onConfirmDelete}
              title={`Bạn có chắc chắn muốn xóa sản phẩm ${row.ten}?`}
            />
          )}
        </>
      )}
    />
  );
};

export default ProductTable;
