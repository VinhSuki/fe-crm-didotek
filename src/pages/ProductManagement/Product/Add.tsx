/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import discountTypeApi from "@/apis/modules/discountType.api";
import productApi from "@/apis/modules/product.api";
import productTypeApi from "@/apis/modules/productType.api";
import unitApi from "@/apis/modules/unit.api";
import warrantyTimeApi from "@/apis/modules/warrantyTime.api";
import ImageUpload from "@/components/common/ImageUpload";
import ClassifyTable from "@/components/common/Table/ClassifyTable";
import { Button } from "@/components/ui/button";
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
import {
  IApiResponse,
  IClassify,
  IDiscountType,
  IProductType,
  IUnit,
  IWarrantyTime,
} from "@/models/interfaces";
import AddClassify from "@/pages/ProductManagement/Product/Classify/Add";
import { showSuccessAlert } from "@/utils/alert";
import { fileToBase64, getImageFromFile } from "@/utils/handleImage";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Editor } from "@tinymce/tinymce-react";
import {
  ChevronDown,
  CircleAlert,
  Ellipsis,
  FileText,
  Image,
  Loader,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

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
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Giá trị phải là số dương",
    }),
  mo_ta: z.string().optional(),
  trang_thai: z
    .string({
      required_error: "Vui lòng chọn trạng thái",
    })
    .transform(Number),
  loai_giam_gia_id: z.string().optional(),
  thoi_gian_bao_hanh_id: z.string().optional(),
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
      trang_thai: z.union([z.string({
        required_error: "Vui lòng chọn trạng thái",
      }),z.number()]),
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
      vat: "0", // Giá trị có thể null thì để undefined
      mo_ta: "",
      chi_tiet_san_pham: [], // Mặc định có một phân loại
      loai_giam_gia_id: "0",
      thoi_gian_bao_hanh_id: "0",
    },
  });
  const convertProductData = async (data: ProductFormValues) => {
    // Chuyển ảnh chính sang Base64 nếu có
    const mainImageBase64 = data.hinh_anh
      ? await fileToBase64(data.hinh_anh)
      : null;

    // Chuyển ảnh và id của chi_tiet_san_pham sang số
    const chiTietSanPham = await Promise.all(
      data.chi_tiet_san_pham.map(async (item) => ({
        ...item,
        hinh_anh: item.hinh_anh ? await fileToBase64(item.hinh_anh) : null,
        trang_thai: Number(item.trang_thai), // ✅ Chuyển trang_thai về số
      }))
    );

    return {
      ...data,
      hinh_anh: mainImageBase64,
      vat: Number(data.vat),
      chi_tiet_san_pham: chiTietSanPham,
      loai_san_pham_id: Number(data.loai_san_pham_id), // ✅ Chuyển về số
      don_vi_tinh_id: Number(data.don_vi_tinh_id), // ✅ Chuyển về số
      trang_thai: Number(data.trang_thai), // ✅ Chuyển về số
      loai_giam_gia_id: data.loai_giam_gia_id
        ? Number(data.loai_giam_gia_id)
        : null, // ✅ Chuyển về số nếu có
      thoi_gian_bao_hanh_id: data.thoi_gian_bao_hanh_id
        ? Number(data.thoi_gian_bao_hanh_id)
        : null, // ✅ Chuyển về số nếu có
    };
  };

  const [loading, setLoading] = useState(false);

  const listProductDetail = form.watch("chi_tiet_san_pham");
  const [listClassify, setListClassify] = useState<IClassify[]>(() =>
    listProductDetail.map((p) => ({
      ...p,
      hinh_anh: getImageFromFile(p.hinh_anh),
    }))
  );
  const [listProductType, setListProductType] = useState<IProductType[]>([]);
  const [listUnit, setListUnit] = useState<IUnit[]>([]);
  const [listDiscountType, setListDiscountType] = useState<IDiscountType[]>([]);
  const [listWarrantyTime, setListWarrantyTime] = useState<IWarrantyTime[]>([]);
  const navigate = useNavigate();

  const fetchApiList = async (api: any, setList: any) => {
    const res: IApiResponse<any[]> = await api.list({});
    if (res) {
      setList(res.data?.data);
    }
  };

  useEffect(() => {
    const getApiList = async () => {
      setLoading(true)
      try {
        await fetchApiList(productTypeApi, setListProductType);
        await fetchApiList(unitApi, setListUnit);
        await fetchApiList(discountTypeApi, setListDiscountType);
        await fetchApiList(warrantyTimeApi, setListWarrantyTime);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getApiList();
  }, []);

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
  const handleEditClassify = (
    id: string | number,
    data: {
      ten_phan_loai: string;
      trang_thai: string | number;
      hinh_anh?: File | undefined;
    }
  ) => {
    form.setValue(
      "chi_tiet_san_pham",
      listProductDetail.map((p, i) => {
        return i === id
          ? {
              ...data,
              hinh_anh: data.hinh_anh || p.hinh_anh,
            }
          : { ...p };
      })
    );
    setListClassify((prev) =>
      prev.map((p, i) => {
        return i === id
          ? {
              ...data,
              hinh_anh: data.hinh_anh
                ? getImageFromFile(data.hinh_anh)
                : p.hinh_anh,
            }
          : { ...p };
      })
    );
  };

  const handleDeleteClassify = async (id: number | string) => {
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
    const convertData = await convertProductData(data);
    console.log(convertData);
    try {
      await productApi.add(convertData);
      showSuccessAlert("Thêm dữ liệu thành công!");
      navigate("/san-pham")
    } catch (error: any) {
      form.setError("ten", { type: "manual", message: error.message });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log("Lỗi submit:", errors)
          )}
        >
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
                          <FormLabel>Tên sản phẩm (*)</FormLabel>
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
                          <FormLabel>Mã sản phẩm (*)</FormLabel>
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
                            <FormLabel>Loại sản phẩm (*)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn loại sản phẩm" />
                                </SelectTrigger>
                              </FormControl>
                              {listProductType.length > 0 && (
                                <SelectContent>
                                  {listProductType.map((v) => (
                                    <SelectItem value={String(v.ID)} key={v.ID}>
                                      {v.ten}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              )}
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
                            <FormLabel>Đơn vị tính (*)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn đơn vị tính" />
                                </SelectTrigger>
                              </FormControl>
                              {listUnit.length > 0 && (
                                <SelectContent>
                                  {listUnit.map((v) => (
                                    <SelectItem value={String(v.ID)} key={v.ID}>
                                      {v.ten}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              )}
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
                            value={field?.value} // ✅ Gán giá trị từ React Hook Form
                            onEditorChange={(content) =>
                              field.onChange(content)
                            } // ✅ Cập nhật state của form
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
                    onDeleted={handleDeleteClassify}
                    onEdited={handleEditClassify}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible defaultOpen={true}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between text-primary p-4 bg-white border w-full rounded-t-md">
                  <div className="flex gap-2">
                    <Ellipsis />
                    <span className="font-bold">Thông tin khác</span>
                  </div>
                  <ChevronDown />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <div className="p-4 bg-white border w-full space-y-4 rounded-b-md">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="vat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>VAT (%)</FormLabel>
                          <FormControl>
                            <Input {...field} min={0} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="trang_thai"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái (*)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={
                              field.value ? String(field.value) : undefined
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Đang kinh doanh</SelectItem>
                              <SelectItem value="0">
                                Ngừng kinh doanh
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="loai_giam_gia_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại giảm giá</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn loại giảm giá" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={"0"}>
                                Chọn loại giảm giá
                              </SelectItem>
                              {listDiscountType.map((v) => (
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
                    <FormField
                      control={form.control}
                      name="thoi_gian_bao_hanh_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thời gian bảo hành</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn thời gian bảo hành" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={"0"}>
                                Chọn thời gian bảo hành
                              </SelectItem>
                              {listWarrantyTime.map((v) => (
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
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="fixed bottom-5 right-5 space-x-2 z-50">
            <Link to={"/san-pham"}>
              <Button type="button" className="bg-black/80 hover:bg-black">
                Đóng
              </Button>
            </Link>

            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </Form>
      {loading && <Loader />}
    </>
  );
};

export default Add;
