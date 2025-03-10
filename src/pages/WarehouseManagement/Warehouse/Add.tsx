/* eslint-disable @typescript-eslint/no-explicit-any */
import warehouseApi from "@/apis/modules/warehouse.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccessAlert } from "@/utils/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const warehouseSchema = z.object({
  ten: z.string().min(1, "Vui lòng nhập tên đơn vị tính"),
  dia_chi: z.string().min(1, "Vui lòng nhập tên đơn vị tính"),
});

type warehouseFormValues = z.infer<typeof warehouseSchema>;

export default function Add({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<warehouseFormValues>({
    resolver: zodResolver(warehouseSchema), // Truyền warehouses vào schema
  });
  const handleResetForm = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: warehouseFormValues) => {
    try {
      await warehouseApi.add(data);
      handleResetForm();
      onAdded();
      showSuccessAlert("Thêm dữ liệu thành công!");
    } catch (error: any) {
      setError("ten", { type: "manual", message: error.message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-secondary text-white">
          <Plus />
          <span>Thêm mới</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="border-b pb-4">Thêm kho</DialogTitle>
        </DialogHeader>
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Input Ảnh */}
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="ten" className="text-zinc-500">
                Tên kho
              </Label>
              <div className="col-span-3">
                <Input
                  autoComplete="off"
                  id="ten"
                  {...register("ten")}
                />
                {errors.ten && (
                  <p className="text-red-500 text-sm">{errors.ten.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="dia_chi" className="text-zinc-500">
                Địa chỉ
              </Label>
              <div className="col-span-3">
                <Input
                  autoComplete="off"
                  id="dia_chi"
                  {...register("dia_chi")}
                />
                {errors.dia_chi && (
                  <p className="text-red-500 text-sm">{errors.dia_chi.message}</p>
                )}
              </div>
            </div>

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
        </>
      </DialogContent>
    </Dialog>
  );
}
