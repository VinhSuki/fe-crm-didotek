import discountTypeApi from "@/apis/modules/discountType.api";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import GenericTable from "@/components/common/GenericTable";
import { useAuthContext } from "@/context/AuthContext";
import {
  Column,
  FilterSearch,
  IDiscountType,
  ISortOrder,
} from "@/models/interfaces";
import Edit from "@/pages/ProductManagement/DiscountType/Edit";
import { useCallback } from "react";

interface IDiscountTypeTableProps {
  discountTypes: IDiscountType[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IDiscountType>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IDiscountType>) => void;
  onDeleted: () => void;
  onEdited: () => void;
}

const columns: Column<IDiscountType>[] = [
  { key: "ID", sortName: "ID", label: "ID" },
  {
    key: "ten",
    label: "Tên loại giảm giá",
    sortName: "ten",
    searchCondition: "text",
  },
  {
    key: "gia_tri",
    label: "Giá trị (%)",
    sortName: "gia_tri",
    searchCondition: "number",
  },
  { key: "CreatedAt", sortName: "created_at", label: "Ngày tạo" },
];

const DiscountTypeTable = ({
  discountTypes,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
  onDeleted,
  onEdited,
}: IDiscountTypeTableProps) => {
  const authMethod = useAuthContext();
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      // eslint-disable-next-line no-useless-catch
      try {
        await discountTypeApi.delete(id);
        onDeleted();
      } catch (error) {
        throw error;
      }
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  // console.log("re-render");
  return (
    <GenericTable<IDiscountType>
      data={discountTypes}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <>
          {authMethod?.checkPermission("update-loai-giam-gia") && (
            <Edit onEdited={onEdited} discountType={row} />
          )}
          {authMethod?.checkPermission("delete-loai-giam-gia") && (
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

export default DiscountTypeTable;
