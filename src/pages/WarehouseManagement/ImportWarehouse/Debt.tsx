/* eslint-disable @typescript-eslint/no-explicit-any */
import importWarehouseApi from "@/apis/modules/importWarehouse.api";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IImportWarehouse } from "@/models/interfaces";
import { showSuccessAlert } from "@/utils/alert";
import formatVND from "@/utils/formatVND";
import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const warehouseSchema = z.object({
  tien_tra: z.union([z.string(), z.number()]),
  hoa_don_id: z.number(),
});

type warehouseFormValues = z.infer<typeof warehouseSchema>;

export default function Debt({
  onDebt,
  importWarehouse,
}: {
  onDebt: () => void;
  importWarehouse: IImportWarehouse;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<warehouseFormValues>({
    resolver: zodResolver(warehouseSchema), // Truyền warehouses vào schema
  });
  useEffect(() => {
    if (importWarehouse.ID) {
      form.setValue("hoa_don_id", Number(importWarehouse.ID));
    }
  }, [form, importWarehouse.ID]);
  const handleResetForm = () => {
    form.reset();
    setOpen(false);
  };

  const onSubmit = async (data: warehouseFormValues) => {
    try {
      await importWarehouseApi.debt({
        ...data,
        tien_tra: Number(data.tien_tra),
      });
      handleResetForm();
      onDebt();
      showSuccessAlert("Thêm dữ liệu thành công!");
    } catch (error: any) {
      form.setError("tien_tra", { type: "manual", message: error.message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-700 hover:bg-green-800">
          <Landmark />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="border-b pb-4">Trả nợ</DialogTitle>
        </DialogHeader>
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <FormLabel>Tiền còn lại</FormLabel>
              <NumericInput
                min={0}
                value={formatVND(importWarehouse.con_lai)}
                onChange={() => {}}
                disabled={true}
              />
              {/* Input Ảnh */}
              <FormField
                control={form.control}
                name={`tien_tra`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiền trả</FormLabel>
                    <FormControl>
                      <NumericInput
                        min={0}
                        max={Number(importWarehouse.con_lai)}
                        value={formatVND(field.value ?? "0")}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="space-x-2">
                <Button
                  type="button"
                  className="bg-black/80 hover:bg-black"
                  onClick={handleResetForm}
                >
                  Đóng
                </Button>
                <Button type="submit">Lưu</Button>
              </DialogFooter>
            </form>
          </Form>
        </>
      </DialogContent>
    </Dialog>
  );
}
