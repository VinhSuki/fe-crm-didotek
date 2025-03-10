import warehouseApi from "@/apis/modules/warehouse.api";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import GenericTable from "@/components/common/GenericTable";
import { Column, FilterSearch, ISortOrder, IWarehouse } from "@/models/interfaces";
import Edit from "@/pages/WarehouseManagement/Warehouse/Edit";
import { useCallback } from "react";

interface IWarehouseTableProps {
  warehouse: IWarehouse[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IWarehouse>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IWarehouse>) => void;
  onDeleted: () => void;
  onEdited: () => void;
}

const columns: Column<IWarehouse>[] = [
  { key: "ID", sortName: "ID", label: "ID"},
  {
    key: "ten",
    label: "Tên kho",
    sortName:"ten",
    searchCondition: "text",
  },
  {
    key: "dia_chi",
    label: "Địa chỉ",
    sortName:"dia_chi",
    searchCondition: "text",
  },
  { key: "CreatedAt",sortName:"created_at", label: "Ngày tạo" },
];

const WarehouseTable = ({
  warehouse,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
  onDeleted,
  onEdited,
}: IWarehouseTableProps) => {
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      // eslint-disable-next-line no-useless-catch
      try {
        await warehouseApi.delete(id);
        onDeleted();
      } catch (error) {
        throw error;
      }
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  // console.log("re-render");
  return (
    <GenericTable<IWarehouse>
      data={warehouse}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <>
          <Edit
            onEdited={onEdited}
            warehouse={row}
          />
          <ConfirmDeleteButton
            id={row.ID}
            onConfirm={onConfirmDelete}
            title={`Bạn có chắc chắn muốn xóa kho ${row.ten}?`}
          />
        </>
      )}
    />
  );
};

export default WarehouseTable;
