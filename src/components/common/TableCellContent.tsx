/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { EStatus } from "@/models/enums/status";
import { convertRFC1123 } from "@/utils/convertRFC1123";
import clsx from "clsx";

interface TableCellContentProps {
  keyName: string;
  value: string;
  isImgFile?: boolean;
}

export default function TableCellContent({
  keyName,
  value,
  isImgFile,
}: TableCellContentProps) {
  if (keyName === "hinh_anh") {
    return (
      <img
        src={
          isImgFile
            ? value
            : `${import.meta.env.VITE_API_URL}public/images/${value}}`
        }
        alt="Hình ảnh"
        className="h-16 object-cover rounded bg-zinc-500"
      />
    );
  }

  if (keyName === "CreatedAt") {
    return <>{convertRFC1123(value)}</>;
  }

  if (keyName === "trang_thai") {
    return (
      <Badge className={value === "1" ? "bg-success" : "bg-destructive"}>
        {value === "1" ? "Đang kinh doanh" : "Ngừng kinh doanh"}
      </Badge>
    );
  }

  return <>{value}</>;
}
