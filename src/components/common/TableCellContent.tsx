/* eslint-disable @typescript-eslint/no-explicit-any */
import { EStatus } from "@/models/enums/status";
import { convertRFC1123 } from "@/utils/convertRFC1123";
import clsx from "clsx";

interface TableCellContentProps {
  keyName: string;
  value: string;
}

export default function TableCellContent({
  keyName,
  value,
}: TableCellContentProps) {
  if (keyName === "hinh_anh") {
    return (
      <img
        src={`${import.meta.env.VITE_API_URL}public/images/${value}`}
        alt="Hình ảnh"
        className="w-16 h-16 object-cover rounded"
      />
    );
  }

  if (keyName === "CreatedAt") {
    return <>{convertRFC1123(value)}</>;
  }

  if (keyName === "trang_thai") {
    return (
      <span
        className={clsx(
          value === EStatus.ACTIVE ? "text-success" : "text-danger"
        )}
      >
        {value === EStatus.ACTIVE ? "Đang kinh doanh" : "Ngừng kinh doanh" }
      </span>
    );
  }

  return <>{value}</>;
}
