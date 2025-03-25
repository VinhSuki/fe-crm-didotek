/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import customerApi from "@/apis/modules/customer.api";
import employeeApi from "@/apis/modules/employee.api";
import exportWarehouseApi from "@/apis/modules/exportWarehouse.api";
import Loader from "@/components/common/Loader";
import NumericInput from "@/components/common/NumericInput";
import SelectSearch from "@/components/common/SelectSearch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  FilterSearch,
  IApiResponse,
  IExportWarehouse,
  IOption,
} from "@/models/interfaces";
import formatVND from "@/utils/formatVND";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import ExportProductTable from "./ExportProduct/Table";
import { showErrorAlert, showSuccessAlert } from "@/utils/alert";
// import AddImportProduct from "./Product/Add";

const listOptionTypeDiscount: IOption[] = [
  {
    ID: "1",
    ten: "Quà tặng",
  },
  {
    ID: "2",
    ten: "Tiền mặt",
  },
];
const exportWarehouseSchema = z.object({
  hoa_don_id: z.union([z.string(), z.number()]),
  ngay_xuat: z.date({
    required_error: "Vui lòng chọn ngày xuất",
  }),
  da_giao_hang: z.boolean(),
  ghi_chu: z.string(),
  gia_tri_chiet_khau: z.union([z.string(), z.number()]),
  khach_hang_id: z.string({
    required_error: "Vui lòng chọn khách hàng",
  }),
  loai_chiet_khau: z.string({
    required_error: "Vui lòng chọn loại chiết khấu",
  }),
  nhan_vien_giao_hang_id: z.string({
    required_error: "Vui lòng chọn nhân viên giao hàng",
  }),
  nhan_vien_sale_id: z.string({
    required_error: "Vui lòng chọn nhân viên sale",
  }),
  thanh_tien: z.union([z.string(), z.number()]),
  tong_tien: z.union([z.string(), z.number()]),
  tra_truoc: z.union([z.string(), z.number()]),
  con_lai: z.union([z.string(), z.number()]),
  vat: z.union([z.string(), z.number()]),
});
type ExportWarehouseFormValues = z.infer<typeof exportWarehouseSchema>;

const Add = () => {
  const params = useParams();
  const exportWarehouseId = params.exportWarehouseId;
  const [exportWarehouse, setExportWarehouse] =
    useState<IExportWarehouse>(Object);
  const form = useForm({
    resolver: zodResolver(exportWarehouseSchema),
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sidebar = useSidebarContext();
  const [listOptionCustomers, setListOptionCustomers] = useState<IOption[]>([]);
  const [listOptionDeliveryEmployees, setListOptionDeliveryEmployees] =
    useState<IOption[]>([]);
  const [listOptionSaleEmployees, setListOptionSalEmployees] = useState<
    IOption[]
  >([]);
  const totalMoney = Number(form.watch("tong_tien") ?? 0);
  const resultMoney = Number(form.watch("thanh_tien") ?? 0);
  const prepayment = Number(form.watch("tra_truoc") ?? 0);
  useEffect(() => {
    const vat = Number(form.getValues("vat"));
    if (totalMoney > 0 && vat > 0) {
      const total = Math.trunc(totalMoney * (1 + vat / 100));
      form.setValue("thanh_tien", String(total));
    } else {
      form.setValue("thanh_tien", String(totalMoney));
    }
  }, [form.watch("vat"), totalMoney]);
  useEffect(() => {
    form.setValue("con_lai", resultMoney - prepayment);
  }, [prepayment, resultMoney]);
  const convertExportWarehouse = async (data: ExportWarehouseFormValues) => {
    return {
      hoa_don_id: Number(data.hoa_don_id),
      khach_hang_id: Number(data.khach_hang_id),
      nhan_vien_giao_hang_id: Number(data.nhan_vien_giao_hang_id),
      nhan_vien_sale_id: Number(data.nhan_vien_sale_id),
      ngay_xuat: new Date(data.ngay_xuat).toISOString(), // Chuyển ngày thành chuỗi ISO
      ghi_chu: data.ghi_chu,
      tong_tien: Number(data.tong_tien),
      vat: Number(data.vat),
      thanh_tien: Number(data.thanh_tien),
      da_giao_hang: data.da_giao_hang ? 1 : 0,
      loai_chiet_khau: Number(data.loai_chiet_khau),
      gia_tri_chiet_khau: Number(data.gia_tri_chiet_khau),
      tra_truoc: Number(data.tra_truoc),
      con_lai: Number(data.con_lai),
    };
  };

  const fetchApiList = async (
    api: any,
    setList: any,
    filters: FilterSearch[]
  ) => {
    const res: IApiResponse<any[]> = await api.list({ filters });
    const data = res.data?.data;
    if (data) {
      setList(
        data.map((v) => ({
          ID: v.ID ?? v.chuc_vu_id,
          ten: v.ho_ten,
        }))
      );
    }
  };

  useEffect(() => {
    const getApiList = async () => {
      setLoading(true);
      try {
        await fetchApiList(customerApi, setListOptionCustomers, []);
        await fetchApiList(employeeApi, setListOptionDeliveryEmployees, [
          { field: "chuc_vu.ten", condition: "=", value: "Giao hàng" },
        ]);
        await fetchApiList(employeeApi, setListOptionSalEmployees, [
          { field: "chuc_vu.ten", condition: "=", value: "Sale" },
        ]);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getApiList();
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      const res = await exportWarehouseApi.list({
        filters: [
          {
            field: "hoa_don_xuat_kho.id",
            condition: "=",
            value: exportWarehouseId,
          },
        ],
      });
      const data = res.data?.data ?? [];
      if (data) {
        setExportWarehouse(data[0]);
      }
    };
    if (exportWarehouseId) fetchApi();
  }, [exportWarehouseId]);

  useEffect(() => {
    form.reset({
      hoa_don_id: exportWarehouse.ID,
      ngay_xuat: exportWarehouse.ngay_xuat
        ? new Date(exportWarehouse.ngay_xuat)
        : undefined, // Ngày xuất mặc định là hôm nay
      da_giao_hang: Boolean(exportWarehouse.da_giao_hang), // Mặc định là chưa giao hàng
      ghi_chu: exportWarehouse.ghi_chu, // Ghi chú trống
      gia_tri_chiet_khau: exportWarehouse.gia_tri_chiet_khau, // Giảm giá mặc định là 0
      loai_chiet_khau: String(exportWarehouse.loai_chiet_khau),
      thanh_tien: exportWarehouse.thanh_tien, // Thành tiền mặc định là 0
      tong_tien: exportWarehouse.tong_tien, // Tổng tiền mặc định là 0
      tra_truoc: exportWarehouse.tra_truoc, // Trả trước mặc định là 0
      con_lai: exportWarehouse.con_lai, // Còn lại mặc định là 0
      vat: exportWarehouse.vat, // VAT mặc định là 0
      nhan_vien_sale_id: String(exportWarehouse.nhan_vien_sale_id),
      nhan_vien_giao_hang_id: String(exportWarehouse.nhan_vien_giao_hang_id),
      khach_hang_id: String(exportWarehouse.khach_hang_id),
    });
  }, [exportWarehouse]);

  const onSubmit = async (data: ExportWarehouseFormValues) => {
    const convertData = await convertExportWarehouse(data);
    try {
      await exportWarehouseApi.edit(convertData);
      showSuccessAlert("Cập nhật dữ liệu thành công!");
      navigate("/xuat-kho");
    } catch (error: any) {
      showErrorAlert(error.message);
      // form.setError("ten", { type: "manual", message: error.message });
    }
  };
  return (
    <>
      {Object.keys(exportWarehouse).length > 0 &&
      listOptionCustomers.length > 0 &&
      listOptionDeliveryEmployees.length > 0 &&
      listOptionSaleEmployees.length > 0 ? (
        <Form {...form}>
          <form
            noValidate={true}
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log(errors);
            })}
          >
            <Card>
              <CardContent
                className={clsx(
                  "p-4 overflow-x-auto space-y-6",
                  sidebar.isCollapsed ? "max-w-[1380px]" : "max-w-[1200px]"
                )}
              >
                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="ngay_xuat"
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
                    name="khach_hang_id"
                    label="Khách hàng"
                    options={listOptionCustomers}
                    placeholder="Chọn khách hàng"
                  />
                  <SelectSearch
                    form={form}
                    name="nhan_vien_giao_hang_id"
                    label="Nhân viên giao hàng"
                    options={listOptionDeliveryEmployees}
                    placeholder="Chọn nhân viên giao hàng"
                  />
                  <SelectSearch
                    form={form}
                    name="nhan_vien_sale_id"
                    label="Nhân viên sale"
                    options={listOptionSaleEmployees}
                    placeholder="Chọn nhân viên sale"
                  />
                </div>
                <Card>
                  <CardHeader className="flex-row justify-between items-center border-b p-4">
                    <h3 className="text-emphasis font-bold">Sản phẩm</h3>
                  </CardHeader>
                  <CardContent className={clsx("p-4 overflow-x-auto")}>
                    <ExportProductTable
                      type="edit"
                      exportProducts={exportWarehouse.ds_san_pham_xuat.map(
                        (p) => ({
                          ...p,
                          thanh_tien_truoc_chiet_khau:
                            Number(p.gia_ban) * Number(p.so_luong_ban),
                        })
                      )}
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
                    name={"vat"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VAT (%)</FormLabel>
                        <FormControl>
                          <NumericInput
                            min={0}
                            max={99}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"thanh_tien"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thành tiền</FormLabel>
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={"tra_truoc"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trả trước</FormLabel>
                        <FormControl>
                          <NumericInput
                            min={0}
                            max={Number(resultMoney)}
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
                        <Textarea
                          className="resize-none h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between gap-4">
                  <div className="w-[45%]">
                    <SelectSearch
                      form={form}
                      name="loai_chiet_khau"
                      label="Loại chiết khấu"
                      options={listOptionTypeDiscount}
                      placeholder="Chọn loại chiết khấu"
                    />
                  </div>
                  <div className="w-[45%]">
                    <FormField
                      control={form.control}
                      name={"gia_tri_chiet_khau"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá trị chiết khấu</FormLabel>
                          <FormControl>
                            <NumericInput
                              min={0}
                              value={field.value}
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
                    name={"da_giao_hang"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đã giao hàng</FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-center">
                            <Checkbox
                              className="block"
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="fixed bottom-5 right-5 space-x-2 z-50">
              <Link to={"/xuat-kho"}>
                <Button type="button" className="bg-black/80 hover:bg-black">
                  Đóng
                </Button>
              </Link>

              <Button type="submit">Lưu</Button>
            </div>
          </form>
        </Form>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Add;
