import GenericTable from "@/components/common/GenericTable";
import {
  Column,
  FilterSearch,
  IExportWarehouse,
  ISortOrder,
} from "@/models/interfaces";
import View from "@/pages/WarehouseManagement/ImportWarehouse/View";

interface IExportWarehouseTableProps {
  exportWarehouses: IExportWarehouse[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IExportWarehouse>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IExportWarehouse>) => void;
  onViewInvoice?: () => void;
}

const columns: Column<IExportWarehouse>[] = [
  {
    key: "ma_hoa_don",
    label: "Mã",
    sortName: "ma_hoa_don",
    searchCondition: "text",
    minW: "min-w-[100px]",
  },
  {
    key: "khach_hang",
    label: "Khách hàng",
    sortName: "khach_hang",
    searchCondition: "text",
    minW: "min-w-[150px]",
  },
  {
    key: "nv_giao_hang",
    label: "Nhân viên giao hàng",
    sortName: "nv_giao_hang",
    searchCondition: "text",
    minW: "min-w-[150px]",
  },
  {
    key: "nv_sale",
    label: "Nhân viên sale",
    sortName: "nv_sale",
    searchCondition: "text",
    minW: "min-w-[150px]",
  },
  {
    key: "ngay_xuat",
    label: "Ngày xuất",
    minW: "min-w-[100px]",
  },
  {
    key: "tong_tien",
    label: "Tổng tiền",
    sortName: "tong_tien",
    searchCondition: "money",
    minW: "min-w-[150px]",
  },
  {
    key: "tra_truoc",
    label: "Trả trước",
    sortName: "tra_truoc",
    searchCondition: "money",
    minW: "min-w-[150px]",
  },
  {
    key: "con_lai",
    label: "Tiền còn lại",
    sortName: "con_lai",
    searchCondition: "money",
    minW: "min-w-[150px]",
  },
  {
    key: "ghi_chu",
    label: "Ghi chú",
    sortName: "ghi_chu",
    searchCondition: "text",
    minW: "min-w-[150px]",
  },
  {
    key: "CreatedAt",
    sortName: "CreatedAt",
    label: "Ngày tạo",
    minW: "min-w-[150px]",
  },
];

const ExportWarehouseTable = ({
  exportWarehouses,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
}: IExportWarehouseTableProps) => {
  return (
    <GenericTable<IExportWarehouse>
      data={exportWarehouses}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      // actions={(row) => <View importWarehouse={row} />}
    />
  );
};

export default ExportWarehouseTable;
