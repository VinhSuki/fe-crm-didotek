import exportWarehouseApi from "@/apis/modules/exportWarehouse.api";
import ConfirmLockButton from "@/components/common/ConfirmLockButton";
import GenericTable from "@/components/common/GenericTable";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import {
  Column,
  FilterSearch,
  IExportWarehouse,
  ISortOrder,
} from "@/models/interfaces";
import Debt from "@/pages/WarehouseManagement/ExportWarehouse/Debt";
import Return from "@/pages/WarehouseManagement/ExportWarehouse/Return";
import View from "@/pages/WarehouseManagement/ExportWarehouse/View";
import clsx from "clsx";
import { PiggyBank, SquarePen } from "lucide-react";
import { useCallback } from "react";
import { Link } from "react-router-dom";

interface IExportWarehouseTableProps {
  exportWarehouses: IExportWarehouse[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IExportWarehouse>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IExportWarehouse>) => void;
  onViewInvoice?: () => void;
  onLocked: () => void;
  onReturned: () => void;
  onDebt: () => void;
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
  onLocked,
  onReturned,
  onDebt,
}: IExportWarehouseTableProps) => {
  const authMethod = useAuthContext();
  const onConfirmLock = useCallback(
    async (id: string | number, isLocked: boolean) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const data = {
          hoa_don_id: Number(id),
          lock_or_open: isLocked ? "lock" : "open",
        };
        await exportWarehouseApi.lock(data);
        onLocked();
      } catch (error) {
        throw error;
      }
    },
    [onLocked]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  return (
    <GenericTable<IExportWarehouse>
      data={exportWarehouses}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <>
          <View exportWarehouse={row} />
          {authMethod?.checkPermission("update-hoa-don-xuat-kho") && (
            <Link to={row.khoa_don ? "#" : `cap-nhat/${row.ID}`}>
              <Button
                disabled={row.khoa_don}
                className={clsx(
                  "bg-zinc-700 hover:bg-zinc-800",
                  row.khoa_don ? "bg-zinc-100 cursor-default" : ""
                )}
              >
                <SquarePen />
              </Button>
            </Link>
          )}
          {authMethod?.checkPermission("lock-hoa-don-xuat-kho") && (
            <ConfirmLockButton
              isLocked={row?.khoa_don ?? false}
              id={row.ID}
              onConfirm={onConfirmLock}
            />
          )}
          {authMethod?.checkPermission("tra-hang-hoa-don-xuat-kho") && (
            <Return exportWarehouse={row} onReturned={onReturned} />
          )}
          <Debt exportWarehouse={row} onDebt={onDebt} />
          {authMethod?.checkPermission("view-cong-no-nha-phan-phoi") && (
            <Link to={`cong-no`}>
              <Button
                className={clsx(
                  "bg-purple-700 hover:bg-purple-800",
                )}
              >
                <PiggyBank
                />
              </Button>
            </Link>
          )}
        </>
      )}
    />
  );
};

export default ExportWarehouseTable;
