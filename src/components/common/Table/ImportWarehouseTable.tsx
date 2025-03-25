import importWarehouseApi from "@/apis/modules/importWarehouse.api";
import ConfirmLockButton from "@/components/common/ConfirmLockButton";
import GenericTable from "@/components/common/GenericTable";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import {
  Column,
  FilterSearch,
  IImportWarehouse,
  ISortOrder,
} from "@/models/interfaces";
import Return from "@/pages/WarehouseManagement/ImportWarehouse/Return";
import View from "@/pages/WarehouseManagement/ImportWarehouse/View";
import clsx from "clsx";
import { SquarePen } from "lucide-react";
import { useCallback } from "react";
import { Link } from "react-router-dom";

interface IImportWarehouseTableProps {
  importWarehouses: IImportWarehouse[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IImportWarehouse>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IImportWarehouse>) => void;
  onLocked: () => void;
  onReturned: () => void;
}

const columns: Column<IImportWarehouse>[] = [
  {
    key: "ma_hoa_don",
    label: "Mã",
    sortName: "ma_hoa_don",
    searchCondition: "text",
    minW: "min-w-[100px]",
  },
  {
    key: "nha_phan_phoi",
    label: "Nhà phân phối",
    sortName: "nha_phan_phoi",
    searchCondition: "text",
  },
  {
    key: "kho",
    label: "Kho",
    sortName: "kho",
    searchCondition: "text",
    minW: "min-w-[150px]",
  },
  {
    key: "ngay_nhap",
    label: "Ngày nhập",
    sortName: "ngay_nhap",
    minW: "min-w-[150px]",
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
    label: "Tiền trả trước",
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

const ImportWarehouseTable = ({
  importWarehouses,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
  onLocked,
  onReturned,
}: IImportWarehouseTableProps) => {
  const authMethod = useAuthContext();
  const onConfirmLock = useCallback(
    async (id: string | number, isLocked: boolean) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const data = {
          hoa_don_id: Number(id),
          lock_or_open: isLocked ? "lock" : "open",
        };
        await importWarehouseApi.lock(data);
        onLocked();
      } catch (error) {
        throw error;
      }
    },
    [onLocked]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  return (
    <GenericTable<IImportWarehouse>
      data={importWarehouses}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <>
          <View importWarehouse={row} />
          {authMethod?.checkPermission("update-hoa-don-nhap-kho") && (
            <Link to={row.khoa_don ? "#" : `cap-nhat/${row.ID}`}>
              <Button
                disabled={row.khoa_don}
                className={clsx(
                  "bg-zinc-700 hover:bg-zinc-800",
                  row.khoa_don ? "bg-zinc-100 cursor-default" : ""
                )}
              >
                <SquarePen
                  className={clsx(
                    row.khoa_don ? "text-black cursor-default" : "text-white"
                  )}
                />
              </Button>
            </Link>
          )}
          {authMethod?.checkPermission("lock-hoa-don-nhap-kho") && (
            <ConfirmLockButton
              isLocked={row?.khoa_don ?? false}
              id={row.ID}
              onConfirm={onConfirmLock}
            />
          )}
          {authMethod?.checkPermission("tra-hang-hoa-don-nhap-kho") && (
            <Return importWarehouse={row} onReturned={onReturned} />
          )}
        </>
      )}
    />
  );
};

export default ImportWarehouseTable;
