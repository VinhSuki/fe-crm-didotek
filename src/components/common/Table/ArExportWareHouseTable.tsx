import GenericTable from "@/components/common/GenericTable";
import {
  Column,
  FilterSearch,
  IArExportWarehouse,
  ISortOrder,
} from "@/models/interfaces";

interface IApImportWarehouseTableProps {
  ars: IArExportWarehouse[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IArExportWarehouse>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IArExportWarehouse>) => void;
}

const columns: Column<IArExportWarehouse>[] = [
  {
    key: "khach_hang",
    label: "Khách hàng",
    sortName: "khach_hang",
    searchCondition: "text",
  },
  {
    key: "tong_hoa_don",
    label: "Tổng hóa đơn",
    sortName: "tong_hoa_don",
    searchCondition: "money",
  },
  {
    key: "tong_tien",
    label: "Tổng tiền",
    sortName: "tong_tien",
    searchCondition: "money",
  },
  {
    key: "tra_truoc",
    label: "Tiền trả trước",
    sortName: "tra_truoc",
    searchCondition: "money",
  },
  {
    key: "con_lai",
    label: "Tiền còn lại",
    sortName: "con_lai",
    searchCondition: "money",
  },

];

const ArExportWareHouseTable = ({
  ars,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
}: IApImportWarehouseTableProps) => {
  return (
    <GenericTable<IArExportWarehouse>
      data={ars}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
    />
  );
};

export default ArExportWareHouseTable;
