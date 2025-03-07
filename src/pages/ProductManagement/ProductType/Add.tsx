/* eslint-disable @typescript-eslint/no-explicit-any */
import productTypeApi from "@/apis/modules/productType.api";
import ImageUpload from "@/components/common/ImageUpload";
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
import { fileToBase64 } from "@/utils/handleImage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const productTypeSchema = z.object({
  ten: z.string().min(1, "Vui lòng nhập tên loại sản phẩm"),
  hinh_anh: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "File phải là ảnh",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Kích thước ảnh tối đa 5MB",
    }),
});

type ProductTypeFormValues = z.infer<typeof productTypeSchema>;

export default function Add({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const handleResetForm = () => {
    reset();
    setOpen(false);
  };
  const {
    register,
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductTypeFormValues>({
    resolver: zodResolver(productTypeSchema), // Truyền productTypes vào schema
  });

  const onSubmit = async (data: ProductTypeFormValues) => {
    const mainImageBase64 = data.hinh_anh
      ? await fileToBase64(data.hinh_anh)
      : null;
    const convertData = {
      ...data,
      hinh_anh: mainImageBase64,
    };

    try {
      await productTypeApi.add(convertData);
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
          <DialogTitle className="border-b pb-4">
            Thêm loại sản phẩm
          </DialogTitle>
        </DialogHeader>
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Input Tên */}
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="ten" className="text-zinc-500">
                Hình ảnh
              </Label>
              <div className="col-span-3">
                <Controller
                  name="hinh_anh"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      {...field} // Truyền các props của field vào ImageUpload
                      error={errors.hinh_anh?.message} // Hiển thị lỗi nếu có
                      onChange={(file) => field.onChange(file)} // Cập nhật giá trị khi file thay đổi
                    />
                  )}
                />
              </div>
            </div>

            {/* Input Ảnh */}
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="ten" className="text-zinc-500">
                Tên loại sản phẩm
              </Label>
              <div className="col-span-3">
                <Input
                  id="ten"
                  {...register("ten")}
                  placeholder="Nhập URL ảnh"
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
