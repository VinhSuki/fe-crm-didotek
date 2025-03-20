import employeeApi from "@/apis/modules/employee.api";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import GenericTable from "@/components/common/GenericTable";
import { useAuthContext } from "@/context/AuthContext";
import {
  Column,
  FilterSearch,
  IEmployee,
  ISortOrder,
} from "@/models/interfaces";
import Edit from "@/pages/EmployeeManagement/Employee/Edit";
import { useCallback } from "react";

interface IEmployeesTableProps {
  employees: IEmployee[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IEmployee>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IEmployee>) => void;
  onDeleted: () => void;
  onEdited: () => void;
}

const columns: Column<IEmployee>[] = [
  {
    key: "avatar",
    label: "Ảnh đại diện",
  },
  {
    key: "ten_dang_nhap",
    label: "Tên đăng nhập",
    sortName: "ten_dang_nhap",
    searchCondition: "text",
  },
  {
    key: "ho_ten",
    label: "Họ tên",
    sortName: "ho_ten",
    searchCondition: "text",
  },
  {
    key: "email",
    label: "Email",
    sortName: "email",
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
  {
    key: "chuc_vu",
    label: "Chức vụ",
    sortName: "chuc_vu",
    searchCondition: "text",
  },
  { key: "CreatedAt", sortName: "CreatedAt", label: "Ngày tạo" },
];

const EmployeeTable = ({
  employees,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
  onDeleted,
  onEdited,
}: IEmployeesTableProps) => {
  const authMethod = useAuthContext();
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      // eslint-disable-next-line no-useless-catch
      try {
        await employeeApi.delete(id);
        onDeleted();
      } catch (error) {
        throw error;
      }
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  // console.log("re-render");
  return (
    <GenericTable<IEmployee>
      data={employees}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <>
          {authMethod?.checkPermission("update-nhan-vien") && (
            <Edit onEdited={onEdited} employee={row} />
          )}
          {authMethod?.checkPermission("delete-nhan-vien") && (
            <ConfirmDeleteButton
              id={row.ID}
              onConfirm={onConfirmDelete}
              title={`Bạn có chắc chắn muốn xóa sản phẩm ${row.ten_dang_nhap}?`}
            />
          )}
        </>
      )}
    />
  );
};

export default EmployeeTable;
