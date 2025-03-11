/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { convertRFC1123 } from "@/utils/convertRFC1123";
import formatVND from "@/utils/formatVND";

interface TableCellContentProps {
  keyName: string;
  value: string;
  isImgFile?: boolean;
}

export default function TableCellContent({
  keyName,
  value,
}: TableCellContentProps) {
  if (keyName === "hinh_anh" || keyName === "avatar") {
    return (
      <img
        src={value}
        alt="Hình ảnh"
        className="h-12 object-cover rounded border"
      />
    );
  }

  if (keyName === "CreatedAt" || keyName === "ngay_nhap") {
    return <>{convertRFC1123(value)}</>;
  }

  if (keyName === "con_lai" || keyName === "tong_tien" || keyName === "tra_truoc") {
    return <>{formatVND(value)}</>;
  }

  if (keyName === "trang_thai") {
    return (
      <Badge
        className={
          Number(value) === 1
            ? "bg-success/80 hover:bg-success"
            : "bg-destructive/80 hover:bg-destructive"
        }
      >
        {Number(value) === 1 ? "Đang kinh doanh" : "Ngừng kinh doanh"}
      </Badge>
    );
  }

  return <>{value}</>;
}
