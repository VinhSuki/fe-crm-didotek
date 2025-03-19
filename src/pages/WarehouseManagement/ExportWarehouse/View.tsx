/* eslint-disable react-hooks/exhaustive-deps */
import GenericTable from "@/components/common/GenericTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Column, IImportProduct, IExportWarehouse, IExportProduct } from "@/models/interfaces";
import { convertRFC1123 } from "@/utils/convertRFC1123";
import formatVND from "@/utils/formatVND";
import { Eye } from "lucide-react";
import { useState } from "react";

interface ViewProps {
  exportWarehouse: IExportWarehouse;
}

const columns: Column<IExportProduct>[] = [
  {
    key: "sku",
    label: "Lô",
  },
  {
    key: "ctsp_ten",
    label: "Tên sản phẩm",
  },
  {
    key: "don_vi_tinh",
    label: "Đơn vị tính",
  },
  {
    key: "so_luong",
    label: "Số lượng",
  },
  {
    key: "gia_ban",
    label: "Giá bán",
  },
  {
    key: "chiet_khau",
    label: "Chiết khấu",
  },
  {
    key: "thanh_tien",
    label: "Thành tiền",
  },
  {
    key: "la_qua_tang",
    label: "Quà tặng",
  },
];

export default function View({ exportWarehouse }: ViewProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={()=>setOpen(!open)}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-700 hover:bg-zinc-800">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1400px]">
        <DialogHeader>
          <DialogTitle className="border-b pb-4 text-base">
            Chi tiết hóa đơn xuất kho #{exportWarehouse.ma_hoa_don ?? ""}
          </DialogTitle>
        </DialogHeader>
        <>
          <div className="px-4 py-6 space-y-4 text-sm">
            <div className="space-y-3">
              <h3 className="pb-2 border-b text-emphasis font-bold">Thông tin hóa đơn</h3>
              {/* Input Ảnh */}
              <div className="grid grid-cols-3">
                <p>
                  <span className="text-zinc-500">Mã hóa đơn: </span>
                  <span>{exportWarehouse.ma_hoa_don ?? ""}</span>
                </p>
                <p>
                  <span className="text-zinc-500">Khách hàng: </span>
                  <span>{exportWarehouse.khach_hang ?? ""}</span>
                </p>
                <p>
                  <span className="text-zinc-500">Nhân viên giao hàng: </span>
                  <span>{exportWarehouse.nv_giao_hang ?? ""}</span>
                </p>
                <p>
                  <span className="text-zinc-500">Nhân viên sale: </span>
                  <span>{exportWarehouse.nv_sale ?? ""}</span>
                </p>
                <p>
                  <span className="text-zinc-500">Ngày xuất: </span>
                  <span>
                    {convertRFC1123(String(exportWarehouse.ngay_xuat ?? ""))}
                  </span>
                </p>
                <p>
                  <span className="text-zinc-500">Tổng tiền: </span>
                  <span>
                    {formatVND(String(exportWarehouse.tong_tien ?? ""))}
                  </span>
                </p>
                <p>
                  <span className="text-zinc-500">Trạng thái: </span>
                  <span>
                    {formatVND(String(exportWarehouse.tong_tien ?? ""))}
                  </span>
                </p>
                <p>
                  <span className="text-zinc-500">Ngày tạo: </span>
                  <span>{convertRFC1123(exportWarehouse.CreatedAt ?? "")}</span>
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="pb-2 border-b text-emphasis font-bold">
                Danh sách sản phẩm
              </h3>
              <div className="overflow-x-auto max-w-full">
                <GenericTable<IExportProduct>
                  data={exportWarehouse.ds_san_pham_xuat ?? []}
                  columns={columns}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" className="bg-black/80 hover:bg-black" onClick={()=>setOpen(!open)}>
                Đóng
              </Button>
            </DialogFooter>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
