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
import { IProductType } from "@/models/interfaces";
import { showSuccessAlert } from "@/utils/alert";
import { fileToBase64 } from "@/utils/handleImage";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as z from "zod";

const productTypeSchema = z.object({
  ten: z.string().min(1, "Vui lòng nhập tên loại sản phẩm"),
  hinh_anh: z.union([
    z
      .instanceof(File) // Kiểm tra xem trường này có phải là một instance của File hay không
      .refine((file) => file.type.startsWith("image/"), {
        message: "File phải là ảnh",
      }) // Kiểm tra định dạng file ảnh
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Kích thước ảnh tối đa 5MB",
      }), // Kiểm tra kích thước file
    z.null().optional(),
  ]),
  id: z.union([z.number(), z.string()]),
});

type ProductTypeFormValues = z.infer<typeof productTypeSchema>;

interface EditProps {
  productType: IProductType;
  onEdited: () => void;
}

export default function Edit({ productType, onEdited }: EditProps) {
  const {
    register,
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductTypeFormValues>({
    resolver: zodResolver(productTypeSchema),
    defaultValues: {
      ten: productType.ten,
      id: productType.ID,
    }, // Truyền productTypes vào schema
  });
  const params = useParams();
  console.log(params);

  const resetForm = (data?: ProductTypeFormValues) => {
    if (data) {
      reset({
        ten: data.ten,
        id: data.id,
      });
    } else {
      reset({
        ten: productType.ten,
        id: productType.ID,
      });
    }
  };

  useEffect(() => {
    resetForm();
  }, [productType, reset]);

  const [open, setOpen] = useState(false);
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };
  const handleResetForm = (data?: ProductTypeFormValues) => {
    setOpen(false); // ✅ Đóng form sau khi API gọi thành công
    if (data) resetForm(data);
    else resetForm();
  };
  // const handleOpenChange = (isOpen: boolean) => {
  //   setOpen(isOpen);
  //   if (!isOpen) {
  //     reset({
  //       ten: productType.ten, // Reset lại tên khi đóng dialog
  //     });
  //     setTimeout(() => {
  //       const triggerButton = document.querySelector("[data-dialog-trigger]");
  //       if (triggerButton instanceof HTMLElement) {
  //         triggerButton.focus(); // ✅ Đặt focus về nút mở dialog
  //       }
  //     }, 0);
  //   }
  // };
  const onSubmit = async (data: ProductTypeFormValues) => {
    console.log(data);
    const mainImageBase64 = data.hinh_anh
      ? await fileToBase64(data.hinh_anh)
      : null;
    const convertData = {
      ...data,
      hinh_anh: mainImageBase64,
    };
    console.log(convertData);
    try {
      await productTypeApi.edit(convertData);
      handleResetForm(data);
      onEdited();
      showSuccessAlert("Thêm dữ liệu thành công!");
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
            Sửa loại sản phẩm
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
                      title={productType.ten} // Truyền tên ảnh vào ImageUpload
                      {...field} // Truyền các props của field vào ImageUpload
                      error={errors.hinh_anh?.message} // Hiển thị lỗi nếu có
                      onChange={(file) => field.onChange(file)} // Cập nhật giá trị khi file thay đổi
                      initialImageUrl={productType.hinh_anh} // Hiển thị ảnh ban đầu
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
                  autoComplete="off"
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
