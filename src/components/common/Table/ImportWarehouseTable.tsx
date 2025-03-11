import GenericTable from "@/components/common/GenericTable";
import {
  Column,
  FilterSearch,
  IImportWarehouse,
  ISortOrder,
} from "@/models/interfaces";

interface IImportWarehouseTableProps {
  importWarehouses: IImportWarehouse[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IImportWarehouse>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IImportWarehouse>) => void;
  onViewInvoice?:()=>void
}

const columns: Column<IImportWarehouse>[] = [
  {
    key: "ma_hoa_don",
    label: "Mã",
    sortName: "ma_hoa_don",
    searchCondition: "text",
    minW:"min-w-[150px]"
  },
  {
    key: "nha_phan_phoi",
    label: "Nhà phân phối",
    sortName: "nha_phan_phoi",
    searchCondition: "text",
    minW:"min-w-[150px]"
  },
  {
    key: "kho",
    label: "Kho",
    sortName: "kho",
    searchCondition: "text",
    minW:"min-w-[150px]"
  },
  {
    key: "ngay_nhap",
    label: "Ngày nhập",
    sortName: "ngay_nhap",
  },
  {
    key: "tong_tien",
    label: "Tổng tiền",
    sortName: "tong_tien",
    searchCondition:"money",
    minW:"min-w-[150px]"
  },
  {
    key: "tra_truoc",
    label: "Tiền trả trước",
    sortName: "tra_truoc",
    searchCondition:"money",
    minW:"min-w-[150px]"
  },
  {
    key: "con_lai",
    label: "Tiền còn lại",
    sortName: "con_lai",
    searchCondition:"money",
    minW:"min-w-[150px]"
  },
  {
    key: "ghi_chu",
    label: "Ghi chú",
    sortName: "ghi_chu",
    searchCondition:"text",
    minW:"min-w-[150px]"
  },
  { key: "CreatedAt", sortName: "CreatedAt", label: "Ngày tạo" },
];

const ImportWarehouseTable = ({
  importWarehouses,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
  onViewInvoice,
}: IImportWarehouseTableProps) => {
  return (
    <GenericTable<IImportWarehouse>
      data={importWarehouses}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <div></div>
      )}
    />
  );
};

export default ImportWarehouseTable;
