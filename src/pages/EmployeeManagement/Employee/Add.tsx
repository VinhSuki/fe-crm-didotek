/* eslint-disable @typescript-eslint/no-explicit-any */
import employeeApi from "@/apis/modules/employee.api";
import rolePermissionApi from "@/apis/modules/rolePermission.api";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IApiResponse, IRole } from "@/models/interfaces";
import { showSuccessAlert } from "@/utils/alert";
import { fileToBase64 } from "@/utils/handleImage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const employeeSchema = z.object({
  ten_dang_nhap: z.string().min(1, "Vui lòng nhập tên nhân viên"),
  ho_ten: z.string().min(1, "Vui lòng nhập họ và tên"),
  email: z.string().min(1, "Vui lòng nhập email").email(),
  dien_thoai: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(
      new RegExp("^(03|05|07|08|09|01[2|6|8|9])\\d{8}$"),
      "Số điện thoại không hợp lệ"
    ),
  dia_chi: z.string().min(1, "Vui lòng nhập họ và tên"),
  chuc_vu_id: z.string().min(1, "Vui lòng chọn chức vụ"),
  avatar: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "File phải là ảnh",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Kích thước ảnh tối đa 5MB",
    }),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function Add({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [listRoles, setListRoles] = useState<IRole[]>([]);
  useEffect(() => {
    const fetchApi = async () => {
      const res: IApiResponse<IRole[]> = await rolePermissionApi.list({});
      if (res) {
        setListRoles(res.data?.data ?? []);
      }
    };
    fetchApi();
  }, []);
  const handleResetForm = () => {
    form.reset({
      ten_dang_nhap: "",
      dia_chi: "",
      ho_ten: "",
      email: "",
      dien_thoai: "",
      avatar: undefined,
      chuc_vu_id: "",
    });
    setOpen(false);
  };
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema), // Truyền productTypes vào schema
    defaultValues: {
      ten_dang_nhap: "",
      dia_chi: "",
      ho_ten: "",
      email: "",
      dien_thoai: "",
      avatar: undefined,
      chuc_vu_id: "",
    },
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    const mainImageBase64 = data.avatar
      ? await fileToBase64(data.avatar)
      : null;
    const convertData = {
      ...data,
      chuc_vu_id: Number(data.chuc_vu_id),
      avatar: mainImageBase64,
    };

    try {
      await employeeApi.add(convertData);
      handleResetForm();
      onAdded();
      showSuccessAlert("Thêm dữ liệu thành công!");
    } catch (error: any) {
      form.setError("ten_dang_nhap", {
        type: "manual",
        message: error.message,
      });
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
          <DialogTitle className="border-b pb-4">Thêm nhân viên</DialogTitle>
        </DialogHeader>
        <>
          <Form {...form}>
            <form
              noValidate={true}
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4 max-h-[500px] overflow-y-auto"
            >
              {/* Input Tên */}
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="avatar" className="text-zinc-500">
                  Ảnh đại diện
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="avatar"
                    control={form.control}
                    render={({ field }) => (
                      <ImageUpload
                        {...field} // Truyền các props của field vào ImageUpload
                        error={form.formState.errors.avatar?.message} // Hiển thị lỗi nếu có
                        onChange={(file) => field.onChange(file)} // Cập nhật giá trị khi file thay đổi
                      />
                    )}
                  />
                </div>
              </div>

              {/* Input Ảnh */}
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="ten_dang_nhap" className="text-zinc-500">
                  Tên đăng nhập
                </Label>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="ten_dang_nhap"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="ho_ten" className="text-zinc-500">
                  Họ và tên
                </Label>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="ho_ten"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="email" className="text-zinc-500">
                  Email
                </Label>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} autoComplete="off" type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="dien_thoai" className="text-zinc-500">
                  Điện thoại
                </Label>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="dien_thoai"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="dia_chi" className="text-zinc-500">
                  Địa chỉ
                </Label>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="dia_chi"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="chuc_vu_id" className="text-zinc-500">
                  Chức vụ
                </Label>
                <div className="col-span-3 w-full">
                  <FormField
                    control={form.control}
                    name="chuc_vu_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ? String(field.value) : ""}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-full">
                              <SelectValue placeholder="Chọn chức vụ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listRoles.map((v) => (
                              <SelectItem value={String(v.ID)} key={v.ID}>
                                {v.ten}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
          </Form>
        </>
      </DialogContent>
    </Dialog>
  );
}
