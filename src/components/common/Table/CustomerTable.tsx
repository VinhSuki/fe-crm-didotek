import customerApi from "@/apis/modules/customer.api";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import GenericTable from "@/components/common/GenericTable";
import { useAuthContext } from "@/context/AuthContext";
import {
  Column,
  FilterSearch,
  ICustomer,
  ISortOrder,
} from "@/models/interfaces";
import Edit from "@/pages/PartnerManagement/Customer/Edit";
import { useCallback } from "react";

interface ICustomersTableProps {
  customers: ICustomer[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<ICustomer>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<ICustomer>) => void;
  onDeleted: () => void;
  onEdited: () => void;
}

const columns: Column<ICustomer>[] = [
  {
    key: "ho_ten",
    label: "Họ tên",
    sortName: "ho_ten",
    searchCondition: "text",
  },
  {
    key: "dien_thoai",
    label: "Điện thoại",
    sortName: "dien_thoai",
    searchCondition: "text",
  },
  {
    key: "dia_chi",
    label: "Địa chỉ",
    sortName: "dia_chi",
    searchCondition: "text",
  },
  { key: "CreatedAt", sortName: "CreatedAt", label: "Ngày tạo" },
];

const CustomerTable = ({
  customers,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
  onDeleted,
  onEdited,
}: ICustomersTableProps) => {
  const authMethod = useAuthContext();
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      // eslint-disable-next-line no-useless-catch
      try {
        await customerApi.delete(id);
        onDeleted();
      } catch (error) {
        throw error;
      }
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  // console.log("re-render");
  return (
    <GenericTable<ICustomer>
      data={customers}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <>
          {authMethod?.checkPermission("update-khach-hang") && (
            <Edit onEdited={onEdited} customer={row} />
          )}
          {authMethod?.checkPermission("delete-khach-hang") && (
            <ConfirmDeleteButton
              id={row.ID}
              onConfirm={onConfirmDelete}
              title={`Bạn có chắc chắn muốn xóa sản phẩm ${row.ho_ten}?`}
            />
          )}
        </>
      )}
    />
  );
};

export default CustomerTable;
