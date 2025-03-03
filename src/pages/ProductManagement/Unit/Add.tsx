/* eslint-disable @typescript-eslint/no-explicit-any */
import unitApi from "@/apis/modules/unit";
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
import {
  showSuccessAlert
} from "@/utils/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const unitSchema = z.object({
  ten: z.string().min(1, "Vui lòng nhập tên đơn vị tính"),
});

type unitFormValues = z.infer<typeof unitSchema>;

export default function Add({
  onAdded,
}: {
  onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<unitFormValues>({
    resolver: zodResolver(unitSchema), // Truyền units vào schema
  });
  const handleResetForm = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: unitFormValues) => {
    
    try {
      await unitApi.add(data);
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
          <DialogTitle className="border-b pb-4">Thêm đơn vị tính</DialogTitle>
        </DialogHeader>
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Input Ảnh */}
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="ten" className="text-zinc-500">
                Tên đơn vị tính
              </Label>
              <div className="col-span-3">
                <Input
                  autoComplete="off"
                  id="ten"
                  {...register("ten")}
                  placeholder="Nhập tên đơn vị tính"
                />
                {errors.ten && (
                  <p className="text-red-500 text-sm">{errors.ten.message}</p>
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
