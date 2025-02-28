import productTypeApi from "@/apis/modules/productType";
import ImageUpload from "@/components/common/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IProductType } from "@/models/interfaces";
import {
  showErrorAlert,
  showLoadingAlert,
  showSuccessAlert,
} from "@/utils/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const productTypeSchema = (existingProductTypes: IProductType[]) =>
  z.object({
    ten: z
      .string()
      .min(1, "Vui lòng nhập tên loại sản phẩm")
      .refine((name) => !existingProductTypes.some((p) => p.ten === name), {
        message: "Tên loại sản phẩm đã tồn tại",
      }),
    hinh_anh: z
      .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), {
        message: "File must be an image",
      })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Image size must be less than 5MB",
      }),
  });

type ProductTypeFormValues = z.infer<ReturnType<typeof productTypeSchema>>;


export default function Add({productTypes,onAdded}: {productTypes: IProductType[],onAdded:()=>void}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductTypeFormValues>({
    resolver: zodResolver(productTypeSchema(productTypes)), // Truyền productTypes vào schema
  });

  const onSubmit = async (data: ProductTypeFormValues) => {
    const formData = new FormData();
    // Thêm dữ liệu vào formData
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Nếu là mảng, thêm từng phần tử với cùng tên trường
        value.forEach((item) => formData.append(key, item.toString()));
      } else if (key === "productFile" && value instanceof File) {
        // Kiểm tra và thêm file nếu tồn tại
        formData.append(key, value);
      } else {
        formData.append(key, value as string | Blob);
      }
    });
    reset();
    setOpen(false);
    setLoading(true);
    showLoadingAlert();

    try {
      const res = await productTypeApi.add(formData);
      if (res.error === 0) {
        onAdded();
      }
      showSuccessAlert("Thêm dữ liệu thành công!");
    } catch (error) {
      console.log(error);
      showErrorAlert("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
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

            <DialogFooter>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
          {loading && <Loader type="inside" />}
        </>
      </DialogContent>
    </Dialog>
  );
}
