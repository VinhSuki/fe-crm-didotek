import rolePermissionApi from "@/apis/modules/rolePermission.api";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import GenericTable from "@/components/common/GenericTable";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { Column, FilterSearch, IRole, ISortOrder } from "@/models/interfaces";
import Edit from "@/pages/EmployeeManagement/RolePermission/Edit";
import { Shield } from "lucide-react";
import { useCallback } from "react";
import { Link } from "react-router-dom";

interface IRoleTableProps {
  roles: IRole[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IRole>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IRole>) => void;
  onDeleted: () => void;
  onEdited: () => void;
}

const columns: Column<IRole>[] = [
  {
    key: "ID",
    label: "ID",
  },
  {
    key: "ten",
    label: "Tên chức vụ",
    sortName: "ten",
    searchCondition: "text",
  },
  { key: "CreatedAt", sortName: "CreatedAt", label: "Ngày tạo" },
];

const RoleTable = ({
  roles,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
  onDeleted,
  onEdited,
}: IRoleTableProps) => {
  const authMethod = useAuthContext();
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      // eslint-disable-next-line no-useless-catch
      try {
        await rolePermissionApi.delete(id);
        onDeleted();
      } catch (error) {
        throw error;
      }
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  // console.log("re-render");
  return (
    <GenericTable<IRole>
      data={roles}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <>
          {authMethod?.checkPermission("update-chuc-vu") && (
            <Edit onEdited={onEdited} role={row} />
          )}
          {authMethod?.checkPermission("view-quyen") && (
            <Link to={`${row.ID}/quyen-han`}>
              <Button className="bg-zinc-700 hover:bg-zinc-800">
                <Shield />
              </Button>
            </Link>
          )}
          {authMethod?.checkPermission("delete-chuc-vu") && (
            <ConfirmDeleteButton
              id={row.ID}
              onConfirm={onConfirmDelete}
              title={`Bạn có chắc chắn muốn xóa chức vụ ${row.ten}?`}
            />
          )}
        </>
      )}
    />
  );
};

export default RoleTable;
