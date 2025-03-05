import ImageUpload from "@/components/common/ImageUpload";
import { Button } from "@/components/ui/button";
import { Editor } from "@tinymce/tinymce-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  ChevronDown,
  CircleAlert,
  FileText,
  Image,
  Plus,
  Tag,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AddClassify from "@/pages/ProductManagement/Product/AddClassify";
import { useState } from "react";
import { Link } from "react-router-dom";
import ClassifyTable from "@/components/common/Table/ClassifyTable";
import { IClassify } from "@/models/interfaces";
import { getImageFromFile } from "@/utils/getImageFromFile ";

const productSchema = z.object({
  ten: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
  upc: z.string().min(1, "Vui lòng nhập mã UPC"),
  loai_san_pham_id: z.string({
    required_error: "Vui lòng chọn loại sản phẩm",
  }),
  hinh_anh: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "File phải là ảnh",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Kích thước ảnh tối đa 5MB",
    }),
  don_vi_tinh_id: z.string({
    required_error: "Vui lòng chọn đơn vị tính",
  }),
  vat: z
    .string()
    .min(1, "Vui lòng nhập giá trị")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Giá trị phải là số lớn hơn 0",
    })
    .optional(),
  mo_ta: z.string().optional(),
  trang_thai: z.string({
    required_error: "Vui lòng chọn trạng thái",
  }),
  loai_giam_gia_id: z.number().int().optional(),
  thoi_gian_bao_hanh_id: z.number().int().optional(),
  chi_tiet_san_pham: z.array(
    z.object({
      ten_phan_loai: z.string().min(1, "Vui lòng nhập tên phân loại"),
      hinh_anh: z
        .instanceof(File)
        .refine((file) => !file || file.type.startsWith("image/"), {
          message: "File phải là ảnh",
        })
        .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
          message: "Kích thước ảnh tối đa 5MB",
        }),
      trang_thai: z.string({
        required_error: "Vui lòng chọn trạng thái",
      }),
    })
  ),
});
type ProductFormValues = z.infer<typeof productSchema>;

const Add = () => {
  const form = useForm({
    resolver: zodResolver(productSchema), // Sử dụng zodResolver với schema của bạn
    defaultValues: {
      ten: "",
      upc: "",
      vat: undefined, // Giá trị có thể null thì để undefined
      mo_ta: "",
      trang_thai: "",
      loai_giam_gia_id: undefined,
      thoi_gian_bao_hanh_id: undefined,
      chi_tiet_san_pham: [], // Mặc định có một phân loại
    },
  });

  const listProductDetail = form.watch("chi_tiet_san_pham");
  const [listClassify, setListClassify] = useState<IClassify[]>([]);

  const handleAddClassify = (data: {
    hinh_anh: File;
    trang_thai: string;
    ten_phan_loai: string;
  }) => {
    const updatedListProductDetail = [...(listProductDetail || []), data];
    form.setValue("chi_tiet_san_pham", updatedListProductDetail);
    setListClassify((prev) => [
      ...prev,
      { ...data, hinh_anh: getImageFromFile(data.hinh_anh) },
    ]);
  };

  console.log(listClassify);

  const handleDeleteListClassify = async (id: number | string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        form.setValue(
          "chi_tiet_san_pham",
          listProductDetail.filter((_, i) => i !== id)
        );
        setListClassify((prev) => prev.filter((_, i) => i !== id));
        resolve(); // Đánh dấu hoàn tất
      }, 500);
    });
  };

  const onSubmit = async (data: ProductFormValues) => {
    console.log(data);
    // const formData = new FormData();
    // // Thêm dữ liệu vào formData
    // Object.entries(data).forEach(([key, value]) => {
    //   if (Array.isArray(value)) {
    //     // Nếu là mảng, thêm từng phần tử với cùng tên trường
    //     value.forEach((item) => formData.append(key, item.toString()));
    //   } else if (key === "productFile" && value instanceof File) {
    //     // Kiểm tra và thêm file nếu tồn tại
    //     formData.append(key, value);
    //   } else {
    //     formData.append(key, value as string | Blob);
    //   }
    // });
    // try {
    //   await productTypeApi.add(formData);
    //   handleResetForm();
    //   onAdded();
    //   showSuccessAlert("Thêm dữ liệu thành công!");
    // } catch (error: any) {
    //   setError("ten", { type: "manual", message: error.message });
    // }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Collapsible defaultOpen={true}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between text-primary p-4 bg-white border w-full rounded-t-md">
                  <div className="flex gap-2">
                    <CircleAlert />
                    <span className="font-bold">Thông tin cơ bản</span>
                  </div>
                  <ChevronDown />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <div className="p-4 bg-white border w-full space-y-4 rounded-b-md">
                  <FormField
                    control={form.control}
                    name="ten"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên sản phẩm *</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="upc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã sản phẩm *</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="loai_san_pham_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại sản phẩm</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn loại sản phẩm" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="m@example.com">
                                m@example.com
                              </SelectItem>
                              <SelectItem value="m@google.com">
                                m@google.com
                              </SelectItem>
                              <SelectItem value="m@support.com">
                                m@support.com
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="don_vi_tinh_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại sản phẩm</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn đơn vị tính" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="m@example.com">
                                m@example.com
                              </SelectItem>
                              <SelectItem value="m@google.com">
                                m@google.com
                              </SelectItem>
                              <SelectItem value="m@support.com">
                                m@support.com
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible defaultOpen={true}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between text-primary p-4 bg-white border w-full rounded-t-md">
                  <div className="flex gap-2">
                    <Image />
                    <span className="font-bold">Hình ảnh sản phẩm</span>
                  </div>
                  <ChevronDown />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <div className="p-4 bg-white border w-full rounded-b-md">
                  <Controller
                    name="hinh_anh"
                    control={form.control}
                    render={({ field }) => (
                      <ImageUpload
                        {...field} // Truyền các props của field vào ImageUpload
                        error={form.formState.errors.hinh_anh?.message} // Hiển thị lỗi nếu có
                        onChange={(file) => field.onChange(file)} // Cập nhật giá trị khi file thay đổi
                      />
                    )}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <Collapsible defaultOpen={true}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between text-primary p-4 bg-white border w-full rounded-t-md">
                <div className="flex gap-2">
                  <FileText />
                  <span className="font-bold">Mô tả</span>
                </div>
                <ChevronDown />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="w-full">
              <div className="p-4 bg-white border w-full rounded-b-md">
                <FormField
                  control={form.control}
                  name="mo_ta"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Editor
                          apiKey="p8ur6ziui7qc42bifhbe1b8ovi9286xyu8xzzbu30oy9g5h1"
                          init={{
                            plugins:
                              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                            toolbar:
                              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible defaultOpen={true}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between text-primary p-4 bg-white border w-full rounded-t-md">
                <div className="flex gap-2">
                  <Tag />
                  <span className="font-bold">Phân loại</span>
                </div>
                <ChevronDown />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="w-full">
              <div className="p-4 bg-white border w-full rounded-b-md space-y-4">
                <div className="flex justify-end">
                  <AddClassify onAdded={handleAddClassify} />
                </div>
                <ClassifyTable
                  data={listClassify}
                  onDeleted={handleDeleteListClassify}
                  onEdited={() => console.log("Edit")}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="fixed bottom-5 right-5 space-x-2">
          <Link to={"/san-pham"}>
            <Button type="button" className="bg-black/80 hover:bg-black">
              Đóng
            </Button>
          </Link>

          <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Form>
  );
};

export default Add;
