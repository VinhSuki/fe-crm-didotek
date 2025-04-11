import GenericTable from "@/components/common/GenericTable";
import {
  Column,
  FilterSearch,
  IApImportWarehouse,
  ISortOrder,
} from "@/models/interfaces";

interface IApImportWarehouseTableProps {
  aps: IApImportWarehouse[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IApImportWarehouse>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IApImportWarehouse>) => void;
}

const columns: Column<IApImportWarehouse>[] = [
  {
    key: "nha_phan_phoi",
    label: "Nhà phân phối",
    sortName: "nha_phan_phoi",
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

const ApImportWareHouseTable = ({
  aps,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
}: IApImportWarehouseTableProps) => {
  return (
    <GenericTable<IApImportWarehouse>
      data={aps}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
    />
  );
};

export default ApImportWareHouseTable;
