/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import distributorApi from "@/apis/modules/distributor.api";
import productApi from "@/apis/modules/product.api";
import NumericInput from "@/components/common/NumericInput";
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
import { Textarea } from "@/components/ui/textarea";
import { useSidebarContext } from "@/context/SidebarContext";
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
import formatVND from "@/utils/formatVND";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { z } from "zod";
import AddImportProduct from "./ImportProduct/Add";
import { useWarehouseContext } from "@/context/WarehouseContext";
import importWarehouseApi from "@/apis/modules/importWarehouse.api";
// import AddImportProduct from "./Product/Add";

const importWarehouseSchema = z.object({
  ngay_nhap: z.date({
    required_error: "Vui lòng chọn ngày nhập",
  }),
  nha_phan_phoi_id: z.string({
    required_error: "Vui lòng chọn nhà phân phối",
  }),
  ghi_chu: z.string(),
  kho_id: z.string().min(1, "Vui lòng chọn kho ở trên thanh công cụ"),
  tong_tien: z.union([z.string(), z.number()]),
  tra_truoc: z.union([z.string(), z.number()]),
  con_lai: z.union([z.string(), z.number()]),
  ds_san_pham_nhap: z
    .array(
      z.object({
        chiet_khau: z.union([z.string(), z.number()]),
        ctsp_id: z.union([z.string(), z.number()]),
        don_vi_tinh: z.string(),
        gia_ban: z.union([z.string(), z.number()]),
        gia_nhap: z.union([z.string(), z.number()]),
        ke: z.string(),
        la_qua_tang: z.boolean(),
        san_pham_id: z.union([z.string(), z.number()]),
        so_luong: z.union([z.string(), z.number()]),
        upc: z.string(),
        han_su_dung: z.coerce.date(),
        thanh_tien: z.union([z.string(), z.number()]),
      })
    )
    .min(1, "Vui lòng thêm ít nhất 1 sản phẩm"),
});
type ImportWarehouseFormValues = z.infer<typeof importWarehouseSchema>;

const Add = () => {
  const warehouse = useWarehouseContext();
  const [listImportProduct, setListImportProduct] = useState<IImportProduct[]>(
    []
  );
  const form = useForm({
    resolver: zodResolver(importWarehouseSchema), // Sử dụng zodResolver với schema của bạn
    defaultValues: {
      tong_tien: "0",
      tra_truoc: "0",
      con_lai: "0",
      ghi_chu: "",
      kho_id: String(warehouse?.selectedId ?? ""),
      ds_san_pham_nhap: [],
    },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sidebar = useSidebarContext();
  const [listDistributors, setListDistributors] = useState<IDistributor[]>([]);

  const distributorId = form.watch("nha_phan_phoi_id");
  const [toggleSubmitted, setToggleSubmitted] = useState<boolean>(false);
  const [listProduct, setListProduct] = useState<IProduct[]>([]);
  const [listGroupProduct, setListGroupProduct] = useState<IGroupProduct[]>([]);
  const totalMoney = form.watch("tong_tien") ?? "0";
  const [listTotalMoney, setListTotalMoney] = useState<
    { id: string | number; total: number }[]
  >([]);
  const setListDataImportProduct = (data: IImportProduct[]) => {
    if (data.length > 0) {
      form.setValue("ds_san_pham_nhap", data);
    }
  };
  const handleTotalMoneyChange = (totalData: {
    id: string | number;
    total: number;
  }) => {
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
  const convertImportWarehouse = async (data: ImportWarehouseFormValues) => {
    // Chuyển ảnh và id của ds_san_pham sang số
    const dsSanPham = await Promise.all(
      data.ds_san_pham_nhap.map(async (item) => ({
        ctsp_id: Number(item.ctsp_id),
        chiet_khau: Number(item.chiet_khau),
        san_pham_id: Number(item.san_pham_id),
        so_luong: Number(item.so_luong),
        gia_ban: Number(item.gia_ban),
        gia_nhap: Number(item.gia_nhap),
        thanh_tien: Number(item.thanh_tien),
        don_vi_tinh: item.don_vi_tinh,
        ke: item.ke,
        la_qua_tang: item.la_qua_tang,
        upc: item.upc,
        han_su_dung: new Date(item.han_su_dung).toISOString(), // Chuyển sang chuỗi ISO
      }))
    );

    return {
      ngay_nhap: new Date(data.ngay_nhap).toISOString(), // Chuyển ngày thành chuỗi ISO
      nha_phan_phoi_id: Number(data.nha_phan_phoi_id),
      ghi_chu: data.ghi_chu,
      kho_id: Number(data.kho_id),
      tong_tien: Number(data.tong_tien),
      tra_truoc: Number(data.tra_truoc),
      con_lai: Number(data.con_lai),
      ds_san_pham_nhap: dsSanPham,
    };
  };
  const prepayment = form.watch("tra_truoc");
  useEffect(() => {
    form.setValue("con_lai", Number(totalMoney) - Number(prepayment));
  }, [prepayment]);
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

  useEffect(() => {
    const getApiList = async () => {
      const res = await distributorApi.list({});
      if (res.data?.data) {
        setListDistributors(res.data.data);
      }
    };
    getApiList();
  }, []);

  useEffect(() => {
    form.setValue("kho_id", String(warehouse?.selectedId ?? ""));
  }, [warehouse?.selectedId]);

  const handleAddedProduct = (data: string) => {
    const [groupId, itemId] = data.split(":");
    const group = listGroupProduct.find((p) => String(p.groupId) === groupId);
    const productDetail = group!.items.find((i) => String(i.ID) === itemId);
    setListImportProduct((prev) => [
      ...prev,
      {
        san_pham_id: groupId,
        ctsp_id: itemId,
        ctsp_ten: productDetail?.ten ?? "",
        upc: productDetail!.upc,
        don_vi_tinh: productDetail!.don_vi_tinh,
        han_su_dung: new Date(),
        gia_ban: "0",
        gia_nhap: "0",
        thanh_tien: "0",
        chiet_khau: "0",
        la_qua_tang: false,
        so_luong: "0",
        ke: "",
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
                    ten: importProductFind.ctsp_ten ?? "",
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
  const onSubmit = async (data: ImportWarehouseFormValues) => {
    // console.log(data);
    // console.log(listDataImportProduct);
    const convertData = await convertImportWarehouse(data);
    console.log(convertData);
    try {
      await importWarehouseApi.add(convertData);
      showSuccessAlert("Thêm dữ liệu thành công!");
      navigate("/nhap-kho");
    } catch (error: any) {
      showErrorAlert(error.message);
      // form.setError("ten", { type: "manual", message: error.message });
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          noValidate={true}
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log(errors);
            if (errors.kho_id) {
              showErrorAlert(String(errors.kho_id.message));
            } else if (errors.ds_san_pham_nhap) {
              const isValued = form.getValues("ds_san_pham_nhap").length > 0;
              if (isValued) {
                onSubmit(form.getValues());
              } else {
                showErrorAlert(String(errors.ds_san_pham_nhap.message));
              }
            }
          })}
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
                    toggleSubmitted={toggleSubmitted}
                    setListDataImportProduct={setListDataImportProduct}
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
                          min={0}
                          max={Number(totalMoney)}
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

            <Button
              type="submit"
              onClick={() => setToggleSubmitted(!toggleSubmitted)}
            >
              Lưu
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Add;
