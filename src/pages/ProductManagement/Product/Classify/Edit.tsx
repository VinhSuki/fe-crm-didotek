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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IClassify } from "@/models/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

// Schema
const classifySchema = z.object({
  ten_phan_loai: z.string().min(1, "Vui lòng nhập tên phân loại"),
  hinh_anh: z
    .instanceof(File)
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "File phải là ảnh",
    })
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Kích thước ảnh tối đa 5MB",
    })
    .optional(),
  trang_thai: z.union([z.string(), z.number()]),
  id: z.union([z.string(), z.number()]),
});

// Kiểu dữ liệu
type ClassifyFormValues = z.infer<typeof classifySchema>;

export default function Edit({
  id,
  classify,
  onEdited,
}: {
  id: string | number;
  classify: IClassify;
  onEdited: (id: string | number, data: ClassifyFormValues) => void;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<ClassifyFormValues>({
    resolver: zodResolver(classifySchema),
    defaultValues: {
      ten_phan_loai: classify.ten_phan_loai,
      trang_thai: classify.trang_thai,
      id: classify.ID,
    },
  });

  const resetForm = (data?: ClassifyFormValues) => {
    if (data) {
      form.reset({
        ten_phan_loai: data.ten_phan_loai,
        trang_thai: data.trang_thai,
      });
    } else {
      form.reset({
        ten_phan_loai: classify.ten_phan_loai,
        trang_thai: classify.trang_thai,
      });
    }
  };
  const handleResetForm = (data?: ClassifyFormValues) => {
    setOpen(false); // ✅ Đóng form sau khi API gọi thành công
    if (data) resetForm(data);
    else resetForm();
  };

  const onSubmit = (data: ClassifyFormValues) => {
    onEdited(id, data); // Gửi dữ liệu lên component cha
    handleResetForm(data);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" className="bg-zinc-700 hover:bg-zinc-800">
            <SquarePen />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="border-b pb-4">Thêm phân loại</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="ten_phan_loai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên phân loại *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                name="hinh_anh"
                control={form.control}
                render={({ field }) => (
                  <ImageUpload
                    label="Hình ảnh"
                    {...field} // Truyền các props của field vào ImageUpload
                    error={form.formState.errors.hinh_anh?.message} // Hiển thị lỗi nếu có
                    onChange={(file) => field.onChange(file)} // Cập nhật giá trị khi file thay đổi
                    initialImageUrl={classify.hinh_anh}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="trang_thai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Đang kinh doanh</SelectItem>
                        <SelectItem value="0">Ngừng kinh doanh</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="space-x-2">
              <Button
                type="button"
                className="bg-black/80 hover:bg-black"
                onClick={() => handleResetForm()}
              >
                Đóng
              </Button>
              <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                Lưu
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
