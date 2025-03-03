import unitApi from "@/apis/modules/unit";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import GenericTable from "@/components/GenericTable";
import { Column, FilterSearch, ISortOrder, IUnit } from "@/models/interfaces";
import Edit from "@/pages/ProductManagement/Unit/Edit";
import { useCallback } from "react";

interface ProductTableProps {
  units: IUnit[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IUnit>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IUnit>) => void;
  onDeleted: () => void;
  onEdited: () => void;
}

const columns: Column<IUnit>[] = [
  { key: "ID", sortName: "ID", label: "ID"},
  {
    key: "ten",
    label: "Tên sản phẩm",
    sortName:"ten",
    searchCondition: "text",
  },
  { key: "CreatedAt",sortName:"created_at", label: "Ngày tạo" },
];

const UnitTable = ({
  units,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
  onDeleted,
  onEdited,
}: ProductTableProps) => {
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      // eslint-disable-next-line no-useless-catch
      try {
        await unitApi.delete(id);
        onDeleted();
      } catch (error) {
        throw error;
      }
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  // console.log("re-render");
  return (
    <GenericTable<IUnit>
      data={units}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <>
          <Edit
            onEdited={onEdited}
            unit={row}
          />
          <ConfirmDeleteButton
            id={row.ID}
            onConfirm={onConfirmDelete}
            title={`Bạn có chắc chắn muốn xóa sản phẩm ${row.ten}?`}
          />
        </>
      )}
    />
  );
};

export default UnitTable;
