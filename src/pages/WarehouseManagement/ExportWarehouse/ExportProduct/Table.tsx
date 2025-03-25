import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import GenericTable from "@/components/common/GenericTable";
import { Column, IExportProduct } from "@/models/interfaces";
import { useCallback } from "react";

interface IExportProductsTableProps {
  exportProducts: IExportProduct[];
  onDeleted?: (id: string | number) => void;
  type?: "edit" | "add";
}

const columns: Column<IExportProduct>[] = [
  {
    key: "upc",
    label: "Mã sản phẩm",
  },
  {
    key: "ctsp_ten",
    label: "Tên SP",
  },
  {
    key: "don_vi_tinh",
    label: "ĐVT",
  },
  {
    key: "so_luong_ban",
    label: "SL",
  },
  {
    key: "gia_ban",
    label: "Đơn giá",
  },
  {
    key: "thanh_tien_truoc_chiet_khau",
    label: "Thành Tiền Trước C.Khấu",
  },
  {
    key: "chiet_khau",
    label: "Chiết khấu (%)",
  },
  {
    key: "thanh_tien",
    label: "Thành Tiền Sau C.Khấu",
  },
];

const CustomerTable = ({
  exportProducts,
  onDeleted,
  type = "add",
}: IExportProductsTableProps) => {
  const isDisabled = type === "edit";
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      if (onDeleted) await onDeleted(id);
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  // console.log("re-render");
  return (
    <GenericTable<IExportProduct>
      data={exportProducts}
      columns={columns}
      actions={(_, index) => (
        <>
          {!isDisabled && (
            <ConfirmDeleteButton
              id={index}
              onConfirm={onConfirmDelete}
              title={`Bạn có chắc chắn muốn xóa sản phẩm số ${index + 1}?`}
            />
          )}
        </>
      )}
    />
  );
};

export default CustomerTable;
