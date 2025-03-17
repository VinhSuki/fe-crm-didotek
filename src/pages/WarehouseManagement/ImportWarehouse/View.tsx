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
import { Column, IImportProduct, IImportWarehouse } from "@/models/interfaces";
import { convertRFC1123 } from "@/utils/convertRFC1123";
import formatVND from "@/utils/formatVND";
import { Eye } from "lucide-react";
import { useState } from "react";

interface ViewProps {
  importWarehouse: IImportWarehouse;
}

const columns: Column<IImportProduct>[] = [
  {
    key: "sku",
    label: "Lô",
  },
  {
    key: "ctsp_ten",
    label: "Tên sản phẩm",
  },
  {
    key: "han_su_dung",
    label: "Hạn sử dụng	",
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
    key: "gia_nhap",
    label: "Giá nhập",
  },
  {
    key: "gia_ban",
    label: "Giá bán",
  },
  {
    key: "chiet_khau",
    label: "Chiết khấu	",
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

export default function View({ importWarehouse }: ViewProps) {
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
            Chi tiết hóa đơn nhập kho #{importWarehouse.ma_hoa_don ?? ""}
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
                  <span>{importWarehouse.ma_hoa_don ?? ""}</span>
                </p>
                <p>
                  <span className="text-zinc-500">Nhà phân phối: </span>
                  <span>{importWarehouse.nha_phan_phoi ?? ""}</span>
                </p>
                <p>
                  <span className="text-zinc-500">Kho: </span>
                  <span>{importWarehouse.kho ?? ""}</span>
                </p>
                <p>
                  <span className="text-zinc-500">Ngày nhập: </span>
                  <span>
                    {convertRFC1123(String(importWarehouse.ngay_nhap ?? ""))}
                  </span>
                </p>
                <p>
                  <span className="text-zinc-500">Tổng tiền: </span>
                  <span>
                    {formatVND(String(importWarehouse.tong_tien ?? ""))}
                  </span>
                </p>
                <p>
                  <span className="text-zinc-500">Ngày tạo: </span>
                  <span>{convertRFC1123(importWarehouse.CreatedAt ?? "")}</span>
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="pb-2 border-b text-emphasis font-bold">
                Danh sách sản phẩm
              </h3>
              <div className="overflow-x-auto max-w-full">
                <GenericTable<IImportProduct>
                  data={importWarehouse.ds_san_pham_nhap ?? []}
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
