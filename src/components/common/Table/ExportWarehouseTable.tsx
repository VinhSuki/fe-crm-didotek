import GenericTable from "@/components/common/GenericTable";
import {
  Column,
  FilterSearch,
  IExportWarehouse,
  ISortOrder,
} from "@/models/interfaces";
import View from "@/pages/WarehouseManagement/ExportWarehouse/View";

interface IExportWarehouseTableProps {
  exportWarehouses: IExportWarehouse[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IExportWarehouse>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IExportWarehouse>) => void;
  onhan_vieniewInhan_vienoice?: () => void;
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
    key: "nhan_vien_giao_hang",
    label: "Nhân viên giao hàng",
    sortName: "nhan_vien_giao_hang",
    searchCondition: "text",
    minW: "min-w-[150px]",
  },
  {
    key: "nhan_vien_sale",
    label: "Nhân viên sale",
    sortName: "nhan_vien_sale",
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
      actions={(row) => <View exportWarehouse={row} />}
    />
  );
};

export default ExportWarehouseTable;
