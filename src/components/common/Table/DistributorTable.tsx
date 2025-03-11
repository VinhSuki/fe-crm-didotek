import distributorApi from "@/apis/modules/distributor.api";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import GenericTable from "@/components/common/GenericTable";
import { Button } from "@/components/ui/button";
import {
  Column,
  FilterSearch,
  IDistributor,
  ISortOrder,
} from "@/models/interfaces";
import { SquarePen } from "lucide-react";
import { useCallback } from "react";
import { Link } from "react-router-dom";

interface IDistributorTableProps {
  distributors: IDistributor[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<IDistributor>;
  onFilterChange: (newFilters: FilterSearch[]) => void;
  onSortOrder: (sortOrder: ISortOrder<IDistributor>) => void;
  onDeleted: () => void;
  onEdited: () => void;
}

const columns: Column<IDistributor>[] = [
  {
    key: "ten",
    label: "Tên",
    sortName: "ten",
    searchCondition: "text",
  },
  {
    key: "dia_chi",
    label: "Địa chỉ",
    sortName: "dia_chi",
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
  { key: "CreatedAt", sortName: "CreatedAt", label: "Ngày tạo" },
];

const DistributorTable = ({
  distributors,
  filters,
  sortOrder,
  onFilterChange,
  onSortOrder,
  onDeleted,
}: IDistributorTableProps) => {
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      // eslint-disable-next-line no-useless-catch
      try {
        await distributorApi.delete(id);
        onDeleted();
      } catch (error) {
        throw error;
      }
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  // console.log("re-render");
  return (
    <GenericTable<IDistributor>
      data={distributors}
      columns={columns}
      filters={filters}
      sortOrder={sortOrder}
      onFilterChange={onFilterChange}
      onSortOrder={onSortOrder}
      actions={(row) => (
        <>
          <Link to={`cap-nhat/${row.ID}`}>
            <Button className="bg-zinc-700 hover:bg-zinc-800">
              <SquarePen />
            </Button>
          </Link>
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

export default DistributorTable;
