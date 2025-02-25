import ImageUpload from "@/components/common/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

// Schema xác thực với Zod
const productTypeSchema = z.object({
  ten: z.string().min(1, "Vui lòng nhập tên loại sản phẩm"),
  anh: z
    .instanceof(File) // Kiểm tra xem trường này có phải là một instance của File hay không
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image",
    }) // Kiểm tra định dạng file ảnh
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image size must be less than 5MB",
    }), // Kiểm tra kích thước file
});

type ProductTypeFormValues = z.infer<typeof productTypeSchema>;

export default function Add() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductTypeFormValues>({
    resolver: zodResolver(productTypeSchema),
  });

  const onSubmit = (data: ProductTypeFormValues) => {
    console.log("Dữ liệu sản phẩm:", data);
    // Gửi dữ liệu lên API hoặc cập nhật state tại đây
  };

  return (
    <Dialog>
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
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Input Tên */}
          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="ten" className="text-zinc-500">
              Hình ảnh
            </Label>
            <div className="col-span-3">
              <Controller
                name="anh"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    {...field} // Truyền các props của field vào ImageUpload
                    error={errors.anh?.message} // Hiển thị lỗi nếu có
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
              <Input id="ten" {...register("ten")} placeholder="Nhập URL ảnh" />
              {errors.ten && (
                <p className="text-red-500 text-sm">{errors.ten.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
