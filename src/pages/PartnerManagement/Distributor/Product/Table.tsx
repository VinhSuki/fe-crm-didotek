import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import GenericTable from "@/components/common/GenericTable";
import { Column, IProduct } from "@/models/interfaces";
import { useCallback } from "react";

interface IProductDistributorTableProps {
  products: IProduct[];
  onDeleted: (id: string | number) => void;
}

const columns: Column<IProduct>[] = [
  { key: "upc", label: "Mã" },
  {
    key: "ten",
    label: "Tên",
  },
];

const ProductDistributorTable = ({
  products,
  onDeleted,
}: IProductDistributorTableProps) => {
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      await onDeleted(id);
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi

  return (
    <GenericTable<IProduct>
      data={products}
      columns={columns}
      actions={(row) => (
        <>
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

export default ProductDistributorTable;
