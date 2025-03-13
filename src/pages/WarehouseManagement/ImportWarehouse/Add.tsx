/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import distributorApi from "@/apis/modules/distributor.api";
import productApi from "@/apis/modules/product.api";
import SelectSearch from "@/components/common/SelectSearch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  IDistributor,
  IGroupProduct,
  IImportProduct,
  IProduct,
} from "@/models/interfaces";
import ImportProductTable from "@/pages/WarehouseManagement/ImportWarehouse/ImportProduct/Table";
import {
  showErrorAlert,
  showLoadingAlert,
  showSuccessAlert,
} from "@/utils/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import AddImportProduct from "./ImportProduct/Add";
import { useSidebarContext } from "@/context/SidebarContext";
import Swal from "sweetalert2";
import NumericInput from "@/components/common/NumericInput";
import formatVND from "@/utils/formatVND";
import { Textarea } from "@/components/ui/textarea";
// import AddImportProduct from "./Product/Add";

const distributorSchema = z.object({
  ngay_nhap: z.date({
    required_error: "Vui lòng chọn ngày nhập",
  }),
  nha_phan_phoi_id: z.string({
    required_error: "Vui lòng chọn nhà phân phối",
  }),
  ghi_chu: z.string(),
  kho_id: z.string({
    required_error: "Vui lòng chọn kho ở trên thanh công cụ",
  }),
  tong_tien: z.string(),
  tra_truoc: z
    .string(),
  con_lai: z.string(),
  ds_san_pham_nhap: z
    .array(
      z
        .object({
          chiet_khau: z.string(),
          ctsp_id: z.union([z.string(), z.number()]),
          don_vi_tinh: z.string(),
          gia_ban: z
            .string()
            .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
              message: "Giá trị phải là số dương",
            }),
          gia_nhap: z
            .string()
            .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
              message: "Giá trị phải là số dương",
            }),
          ke: z.string(),
          la_qua_tang: z.boolean(),
          san_pham_id: z.union([z.string(), z.number()]),
          so_luong: z.union([z.string(), z.number()]),
          upc: z.string(),
          han_su_dung: z.date(),
        })
        .superRefine(({ gia_ban, gia_nhap }, ctx) => {
          const giaBanNum = Number(gia_ban);
          const giaNhapNum = Number(gia_nhap);

          if (giaNhapNum >= giaBanNum) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Giá nhập không được lớn hơn giá bán",
              path: ["gia_nhap"], // Gắn lỗi vào trường `gia_nhap`
            });
          }
        })
    ) 
});
type DistributorFormValues = z.infer<typeof distributorSchema>;

const Add = () => {
  const form = useForm({
    resolver: zodResolver(distributorSchema), // Sử dụng zodResolver với schema của bạn
    defaultValues: {
      tong_tien: "0",
      tra_truoc: "0",
      con_lai: "0",
      ds_san_pham_nhap: [],
      ghi_chu: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sidebar = useSidebarContext();
  const [listDistributors, setListDistributors] = useState<IDistributor[]>([]);
  const [listImportProduct, setListImportProduct] = useState<IImportProduct[]>(
    []
  );
  const distributorId = form.watch("nha_phan_phoi_id");
  const [listProduct, setListProduct] = useState<IProduct[]>([]);
  const [listGroupProduct, setListGroupProduct] = useState<IGroupProduct[]>([]);
  const totalMoney = form.watch("tong_tien") ?? "0";
  const [listTotalMoney, setListTotalMoney] = useState<
    { id: string | number; total: number }[]
  >([]);
  const handleTotalMoneyChange = (totalData: {
    id: string | number;
    total: number;
  }) => {
    console.log(listTotalMoney);
    const totalMoneyFind = listTotalMoney.find((v) => v.id === totalData.id);
    if (totalMoneyFind) {
      if (totalMoneyFind.total !== totalData.total)
        setListTotalMoney(
          listTotalMoney.map((v) => {
            return v.id === totalData.id
              ? {
                  ...v,
                  total: totalData.total,
                }
              : v;
          })
        );
    } else {
      setListTotalMoney((prev) => [...prev, totalData]);
    }
  };

  // } else {
  //   setListTotalMoney((prev) => [...prev, totalData]);
  // }

  useEffect(() => {
    const total = listTotalMoney.reduce((acc, cur) => {
      return acc + cur.total;
    }, 0);
    form.setValue("tong_tien", String(total));
  }, [listTotalMoney]);
  useEffect(() => {
    const fetchApi = async () => {
      const res = await distributorApi.list({
        filters: [
          {
            field: "nha_phan_phoi.id",
            condition: "=",
            value: String(distributorId),
          },
        ],
      });
      if (res.data?.data) {
        setListProduct(res.data.data[0].ds_san_pham);
      }
    };
    const handleChangeDistributor = async () => {
      if (listImportProduct.length > 0) {
        const result = await Swal.fire({
          title: "Bạn có chắc muốn đổi nhà phân phối?",
          text: "Dữ liệu sản phẩm được thêm vào sẽ bị làm mới",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
          setLoading(true);
          showLoadingAlert();

          try {
            await fetchApi();
            setListImportProduct([]);
            showSuccessAlert("Đổi nhà phân phối thành công!");
          } catch (error: any) {
            console.log(error);
            showErrorAlert(error.message);
          } finally {
            setLoading(false);
          }
        }
      } else {
        fetchApi();
      }
    };
    if (distributorId) handleChangeDistributor();
  }, [distributorId]);
  useEffect(() => {
    const fetchApi = async () => {
      if (!listProduct.length) return;

      let list: IGroupProduct[] = [];

      // Sử dụng map + Promise.all để chờ tất cả các request
      const results = await Promise.all(
        listProduct.map(async (element) => {
          const id = element.ID;
          if (id) {
            try {
              const res = await productApi.classify(id);
              if (res.data?.data) {
                const classify = res.data?.data;
                return {
                  group: element.ten,
                  groupId: id,
                  items: classify.map((cl) => ({
                    ID: cl.ID ?? "0",
                    ten: cl.ten_phan_loai,
                    upc: element.upc,
                    don_vi_tinh: element.don_vi_tinh,
                  })),
                };
              }
            } catch (error) {
              console.error(`Lỗi khi lấy dữ liệu cho ID: ${id}`, error);
            }
          }
          return null;
        })
      );

      // Loại bỏ các phần tử null và cập nhật state
      list = results.filter(Boolean) as IGroupProduct[];
      setListGroupProduct(list);
    };

    fetchApi();
  }, [listProduct]);

  const convertDistributorData = async (data: DistributorFormValues) => {
    // // Chuyển ảnh và id của ds_san_pham sang số
    // const dsSanPham = await Promise.all(
    //   listProductAdded.map(async (item) => Number(item.ID))
    // );
    // return {
    //   ...data,
    //   ds_san_pham: dsSanPham,
    // };
  };

  // const [listProduct, setListProduct] = useState<IProduct[]>([]);
  // const [listProductAdded, setListProductAdded] = useState<IProduct[]>([]);

  useEffect(() => {
    const getApiList = async () => {
      const res = await distributorApi.list({});
      if (res.data?.data) {
        setListDistributors(res.data.data);
      }
    };
    getApiList();
  }, []);

  const handleAddedProduct = (data: string) => {
    const [groupId, itemId] = data.split(":");
    const group = listGroupProduct.find((p) => String(p.groupId) === groupId);
    const productDetail = group!.items.find((i) => String(i.ID) === itemId);
    setListImportProduct((prev) => [
      ...prev,
      {
        san_pham_id: groupId,
        ctsp_id: itemId,
        ctsp_ten: productDetail!.ten,
        upc: productDetail?.upc,
        don_vi_tinh: productDetail?.don_vi_tinh,
      },
    ]);

    const updatedListGroupProduct = listGroupProduct.map((group) => {
      if (String(group.groupId) === groupId) {
        return {
          ...group,
          items: group.items.filter((i) => String(i.ID) !== itemId),
        };
      }
      return group;
    });

    setListGroupProduct(updatedListGroupProduct);
    // const importProductFind = listProduct.find(
    //   (p) => Number(p.ID) === Number(data.id)
    // );

    // if (!importProductFind) return;

    // setListProductAdded((prev) => {
    //   const newAddedOptions = [...prev, importProductFind];

    //   // Tính tổng số sản phẩm sau khi thêm
    //   const totalProducts = newAddedOptions.length;

    //   // Xác định trang chứa sản phẩm vừa thêm
    //   const newCurrentPage = Math.ceil(
    //     totalProducts / PAGINATION.DEFAULT_LIMIT
    //   );

    //   setPagination((prev) => ({ ...prev, currentPage: newCurrentPage }));

    //   return newAddedOptions;
    // });

    // // Loại bỏ sản phẩm khỏi danh sách có thể thêm
    // setListProduct((prev) =>
    //   prev.filter((p) => Number(p.ID) !== Number(data.id))
    // );
  };

  const handleDeleteImportProduct = async (id: number | string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const [groupId, itemId] = String(id).split(":");
        const importProductFind = listImportProduct.find(
          (p) => Number(p.ctsp_id) === Number(itemId)
        );
        const newImportProductList = listImportProduct.filter(
          (p) => Number(p.ctsp_id) !== Number(itemId)
        );
        const newListTotalMoney = listTotalMoney.filter(
          (v) => String(v.id) !== itemId
        );
        setListImportProduct(newImportProductList);
        setListTotalMoney(newListTotalMoney);

        if (importProductFind) {
          const updatedListGroupProduct = listGroupProduct.map((group) => {
            if (String(group.groupId) === groupId) {
              return {
                ...group,
                items: [
                  ...group.items,
                  {
                    ID: importProductFind.ctsp_id,
                    ten: importProductFind.ctsp_ten,
                    upc: importProductFind.upc,
                    don_vi_tinh: importProductFind.don_vi_tinh,
                  },
                ].sort((a, b) => Number(a.ID) - Number(b.ID)),
              };
            }
            return group;
          });

          setListGroupProduct(updatedListGroupProduct);
        }

        resolve();
      }, 500);
    });
  };
  const onSubmit = async (data: DistributorFormValues) => {
    const convertData = await convertDistributorData(data);
    console.log(convertData);
    try {
      await distributorApi.add(convertData);
      showSuccessAlert("Thêm dữ liệu thành công!");
      navigate("/nha-phan-phoi");
    } catch (error: any) {
      // form.setError("ten", { type: "manual", message: error.message });
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          noValidate={true}
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log(errors)
          )}
        >
          <Card>
            <CardContent
              className={clsx(
                "p-4 overflow-x-auto space-y-6",
                sidebar.isCollapsed ? "max-w-[1380px]" : "max-w-[1200px]"
              )}
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ngay_nhap"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Ngày nhập</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={clsx(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yy") // 🌟 Định dạng tiếng Việt
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SelectSearch
                  form={form}
                  name="nha_phan_phoi_id"
                  label="Nhà phân phối"
                  options={listDistributors}
                  placeholder="Chọn nhà phân phối"
                />
              </div>
              <Card>
                <CardHeader className="flex-row justify-between items-center border-b p-4">
                  <h3 className="text-emphasis font-bold">Sản phẩm</h3>
                  <AddImportProduct
                    onAdded={handleAddedProduct}
                    listGroupProduct={listGroupProduct}
                  />
                </CardHeader>
                <CardContent className={clsx("p-4 overflow-x-auto")}>
                  <ImportProductTable
                    onTotalMoneyChange={handleTotalMoneyChange}
                    listImportProduct={listImportProduct}
                    onDeleted={handleDeleteImportProduct}
                  />
                </CardContent>
              </Card>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={"tong_tien"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tổng tiền</FormLabel>
                      <FormControl>
                        <NumericInput
                          readOnly
                          value={formatVND(field.value ?? "0")}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={"tra_truoc"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trả trước</FormLabel>
                      <FormControl>
                        <NumericInput
                          max={Number(totalMoney)}
                          min={0}
                          value={formatVND(field.value ?? "0")}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={"con_lai"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Còn lại</FormLabel>
                      <FormControl>
                        <NumericInput
                          readOnly
                          value={formatVND(field.value ?? "0")}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="ghi_chu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div className="fixed bottom-5 right-5 space-x-2 z-50">
            <Link to={"/nha-phan-phoi"}>
              <Button type="button" className="bg-black/80 hover:bg-black">
                Đóng
              </Button>
            </Link>

            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Add;
