/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import exportWarehouseApi from "@/apis/modules/exportWarehouse.api";
import NumericInput from "@/components/common/NumericInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IExportWarehouse } from "@/models/interfaces";
import { showErrorAlert, showSuccessAlert } from "@/utils/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { HandCoins } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const productSchema = z.object({
  hoa_don_id: z.union([z.string(), z.number()]),
  ds_san_pham_tra: z.array(
    z.object({
      so_luong_tra: z.union([z.string(), z.number()]),
      cthd_xuat_kho_id: z.union([z.string(), z.number()]),
      sku: z.string(),
    })
  ),
});

type productFormValues = z.infer<typeof productSchema>;
interface TableProps {
  exportWarehouse: IExportWarehouse;
  onReturned:()=>void
}

export default function Return({ exportWarehouse,onReturned }: TableProps) {
  const form = useForm<productFormValues>({
    resolver: zodResolver(productSchema), // Truyền warehouses vào schema
  });
  const [open, setOpen] = useState(false);
  const listImportProduct = exportWarehouse.ds_san_pham_xuat;
  const handleResetForm = () => {
    form.reset();
    setOpen(false);
  };
  useEffect(() => {
    form.reset({
      hoa_don_id: exportWarehouse.ID,
      ds_san_pham_tra: exportWarehouse.ds_san_pham_xuat.map((p) => ({
        so_luong_tra: "0",
        cthd_xuat_kho_id: p.ID,
        sku: p.sku,
      })),
    });
  }, [exportWarehouse]);
  const handleSubmit = async () => {
    const data = form.getValues();
    const convertData = {
      hoa_don_id: Number(data.hoa_don_id),
      ds_san_pham_tra: data.ds_san_pham_tra.map((p) => ({
        ...p,
        cthd_xuat_kho_id: Number(p.cthd_xuat_kho_id),
        so_luong_tra: Number(p.so_luong_tra),
      })),
    };
    try {
      await exportWarehouseApi.return(convertData);
      handleResetForm();
      onReturned();
      showSuccessAlert("Thêm dữ liệu thành công!");
    } catch (error: any) {
      showErrorAlert(error.message)
    }
  };
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-700 hover:bg-yellow-800">
          <HandCoins />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="border-b pb-4 text-base">
            Trả hàng cho hóa đơn #{exportWarehouse.ma_hoa_don ?? ""}
          </DialogTitle>
        </DialogHeader>
        <>
          <div className="px-4 py-6 space-y-4 text-sm">
            <div className="overflow-x-auto max-w-full">
              <Form {...form}>
                <Table className="overflow-x-auto w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className={clsx("whitespace-nowrap min-w-[50px]")}
                      >
                        <div className={`flex items-center space-x-2`}>
                          <span>Lô</span>
                        </div>
                      </TableHead>
                      <TableHead
                        className={clsx("whitespace-nowrap min-w-[100px]")}
                      >
                        <div className={`flex items-center space-x-2`}>
                          <span>Tên SP</span>
                        </div>
                      </TableHead>
                      <TableHead
                        className={clsx("whitespace-nowrap min-w-[100px]")}
                      >
                        <div className={`flex items-center space-x-2`}>
                          <span>Số lượng</span>
                        </div>
                      </TableHead>
                      <TableHead
                        className={clsx("whitespace-nowrap min-w-[100px]")}
                      >
                        <div className={`flex items-center space-x-2`}>
                          <span>Số lượng trả</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Dữ liệu */}
                    {listImportProduct.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.sku}</TableCell>
                        <TableCell>{row.ctsp_ten}</TableCell>
                        <TableCell>{row.so_luong_ban}</TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`ds_san_pham_tra.${index}.so_luong_tra`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <NumericInput
                                    min={0}
                                    max={Number(row.so_luong_ban)}
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Form>
            </div>
            <DialogFooter>
              <Button
                type="button"
                className="bg-black/80 hover:bg-black"
                onClick={() => setOpen(!open)}
              >
                Đóng
              </Button>
              <Button onClick={handleSubmit} type="button">
                Lưu
              </Button>
            </DialogFooter>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
