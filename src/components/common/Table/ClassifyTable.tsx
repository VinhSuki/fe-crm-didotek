/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import TableCellContent from "@/components/common/TableCellContent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Column, IClassify } from "@/models/interfaces";
import Edit from "@/pages/ProductManagement/Product/Classify/Edit";
import clsx from "clsx";
import { useCallback } from "react";

interface IClassifyProps {
  data: IClassify[];
  onDeleted: (id: string | number) => void;
  onEdited: (
    id: string | number,
    data: {
      id: string | number;
      ten_phan_loai: string;
      trang_thai: string | number;
      hinh_anh?: File | undefined;
    }
  ) => void;
}

const columns: Column<IClassify>[] = [
  {
    key: "hinh_anh",
    label: "Hinh ảnh",
  },
  { key: "ten_phan_loai", label: "Tên" },

  { key: "trang_thai", label: "Trạng thái" },
];

const ClassifyTable = ({ data, onDeleted, onEdited }: IClassifyProps) => {
  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      await onDeleted(id);
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi
  return (
    <>
      {data.length === 0 ? (
        <div className="text-center text-zinc-500 text-lg">Chưa có dữ liệu</div>
      ) : (
        <Table className="overflow-x-auto w-full">
          <TableHeader>
            <TableRow>
              {columns.map(({ key, label, minW }) => (
                <TableHead
                  key={String(key)}
                  className={clsx("whitespace-nowrap", minW)}
                >
                  <div className={`flex items-center space-x-2`}>
                    <span>{label}</span>
                  </div>
                </TableHead>
              ))}
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Dữ liệu */}
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map(({ key, render }) => (
                  <TableCell key={String(key)}>
                    {render ? (
                      render(row)
                    ) : (
                      <TableCellContent
                        keyName={String(key)}
                        value={(row as any)[key]}
                      />
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {/* <Edit onEdited={onEdited} productType={row} /> */}
                  <div className="flex space-x-2">
                    <Edit id={index} classify={row} onEdited={onEdited} />
                    <ConfirmDeleteButton
                      id={index}
                      onConfirm={onConfirmDelete}
                      title={`Bạn có chắc chắn muốn xóa sản phẩm ${row.ten_phan_loai}?`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default ClassifyTable;
