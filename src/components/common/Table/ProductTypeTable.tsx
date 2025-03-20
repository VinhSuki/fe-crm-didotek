import productTypeApi from "@/apis/modules/productType.api";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import GenericTable from "@/components/common/GenericTable";
import { useAuthContext } from "@/context/AuthContext";
import {
  Column,
  FilterSearch,
  IProductType,
  ISortOrder,
} from "@/models/interfaces";
import Edit from "@/pages/ProductManagement/ProductType/Edit";
import { useCallback } from "react";

interface IProductTypesTableProps {
  productTypes: IProductType[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IProductType>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IProductType>) => void;
  onDeleted: () => void;
  onEdited: () => void;
}

const columns: Column<IProductType>[] = [
  { key: "ID", sortName: "ID", label: "ID" },
  {
    key: "ten",
    label: "Tên loại sản phẩm",
    sortName: "ten",
    searchCondition: "text",
  },
  {
    key: "hinh_anh",
    label: "Hình ảnh",
  },
  { key: "CreatedAt", sortName: "created_at", label: "Ngày tạo" },
];

const ProductTypeTable = ({
  productTypes,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
  onDeleted,
  onEdited,
}: IProductTypesTableProps) => {
  const authMethod = useAuthContext();
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      // eslint-disable-next-line no-useless-catch
      try {
        await productTypeApi.delete(id);
        onDeleted();
      } catch (error) {
        throw error;
      }
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  // console.log("re-render");
  return (
    <GenericTable<IProductType>
      data={productTypes}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <>
          {authMethod?.checkPermission("update-loai-san-pham") && (
            <Edit onEdited={onEdited} productType={row} />
          )}
          {authMethod?.checkPermission("delete-loai-san-pham") && (
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

export default ProductTypeTable;
