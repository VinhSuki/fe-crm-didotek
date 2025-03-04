/* eslint-disable react-hooks/exhaustive-deps */
import warrantyTimeApi from "@/apis/modules/warrantyTime.api";
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
import { IWarrantyTime } from "@/models/interfaces";
import { showSuccessAlert } from "@/utils/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const warrantyTimeSchema = z.object({
  ten: z.string().min(1, "Vui lòng nhập tên đơn vị tính"),
  id: z.number(),
});

type warrantyTimeFormValues = z.infer<typeof warrantyTimeSchema>;

interface EditProps {
  warrantyTime: IWarrantyTime;
  onEdited: () => void;
}

export default function Edit({ warrantyTime, onEdited }: EditProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<warrantyTimeFormValues>({
    resolver: zodResolver(warrantyTimeSchema),
  });
  const resetForm = (data?: warrantyTimeFormValues) => {
    if (data) {
      reset({
        ten: data.ten,
        id: data.id,
      });
    } else {
      reset({
        ten: warrantyTime.ten,
        id: warrantyTime.ID,
      });
    }
  };

  useEffect(() => {
    resetForm();
  }, [warrantyTime]);
  const [open, setOpen] = useState(false);
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };
  const handleResetForm = (data?: warrantyTimeFormValues) => {
    setOpen(false); // ✅ Đóng form sau khi API gọi thành công
    if (data) resetForm(data);
    else resetForm();
  };
  const onSubmit = async (data: warrantyTimeFormValues) => {
    try {
      await warrantyTimeApi.edit(data);
      handleResetForm(data);
      showSuccessAlert("Chỉnh sửa dữ liệu thành công!");
      onEdited(); // ✅ Gọi callback để cập nhật dữ liệu
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError("ten", { type: "manual", message: error.message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-700 hover:bg-zinc-800">
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="border-b pb-4">
            Chỉnh sửa thời gian bảo hành
          </DialogTitle>
        </DialogHeader>
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Input Ảnh */}
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="ten" className="text-zinc-500">
                Thời gian bảo hành
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

            <DialogFooter>
              <Button
                type="button"
                className="bg-black/80 hover:bg-black"
                onClick={() => handleResetForm()}
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
