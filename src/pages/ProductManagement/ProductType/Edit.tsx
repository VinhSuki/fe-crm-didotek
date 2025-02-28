import productTypeApi from "@/apis/modules/productType";
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
import {
  showErrorAlert,
  showLoadingAlert,
  showSuccessAlert,
} from "@/utils/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, SquarePen } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const productTypeSchema = (
  existingProductTypes: IProductType[],
  id: string | number
) =>
  z.object({
    ten: z
      .string()
      .min(1, "Vui lòng nhập tên loại sản phẩm")
      .refine(
        (name) =>
          !existingProductTypes.some((p) => p.ten === name && p.ID !== id),
        {
          message: "Tên loại sản phẩm đã tồn tại",
        }
      ),
    hinh_anh: z.union([
      z
        .instanceof(File) // Kiểm tra xem trường này có phải là một instance của File hay không
        .refine((file) => file.type.startsWith("image/"), {
          message: "File must be an image",
        }) // Kiểm tra định dạng file ảnh
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "Image size must be less than 5MB",
        }), // Kiểm tra kích thước file
      z.null().optional(),
    ]),
    id: z.number(),
  });

type ProductTypeFormValues = z.infer<ReturnType<typeof productTypeSchema>>;

interface EditProps {
  productType: IProductType;
  productTypes: IProductType[];
  onEdited: () => void;
}

export default function Edit({
  productType,
  productTypes,
  onEdited,
}: EditProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductTypeFormValues>({
    resolver: zodResolver(productTypeSchema(productTypes, productType.ID)),
    defaultValues: {
      ten: productType.ten,
      id: productType.ID,
    }, // Truyền productTypes vào schema
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset({
        ten: productType.ten, // Reset lại tên khi đóng dialog
        id: productType.ID,
      });
    }
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
    setOpen(false); // ✅ Đóng form sau khi API gọi thành công
    setLoading(true);
    showLoadingAlert();

    try {
      const res = await productTypeApi.edit(formData);
      if (res.error === 0) {
        showSuccessAlert("Chỉnh sửa dữ liệu thành công!");
        onEdited(); // ✅ Gọi callback để cập nhật dữ liệu
        reset({ ten: data.ten, id: data.id }); // ✅ Reset lại form
      }
    } catch (error) {
      console.log(error);
      showErrorAlert("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
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
