import warrantyTimeApi from "@/apis/modules/warrantyTime.api";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import GenericTable from "@/components/common/GenericTable";
import { Column, FilterSearch, ISortOrder, IWarrantyTime } from "@/models/interfaces";
import Edit from "@/pages/ProductManagement/WarrantyTime/Edit";
import { useCallback } from "react";

interface IWarrantyTimeTableProps {
  warrantyTimes: IWarrantyTime[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IWarrantyTime>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IWarrantyTime>) => void;
  onDeleted: () => void;
  onEdited: () => void;
}

const columns: Column<IWarrantyTime>[] = [
  { key: "ID", sortName: "ID", label: "ID"},
  {
    key: "ten",
    label: "Thời gian bảo hành",
    sortName:"ten",
    searchCondition: "text",
  },
  { key: "CreatedAt",sortName:"created_at", label: "Ngày tạo" },
];

const WarrantyTimeTable = ({
  warrantyTimes,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
  onDeleted,
  onEdited,
}: IWarrantyTimeTableProps) => {
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      // eslint-disable-next-line no-useless-catch
      try {
        await warrantyTimeApi.delete(id);
        onDeleted();
      } catch (error) {
        throw error;
      }
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  // console.log("re-render");
  return (
    <GenericTable<IWarrantyTime>
      data={warrantyTimes}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <>
          <Edit
            onEdited={onEdited}
            warrantyTime={row}
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

export default WarrantyTimeTable;
