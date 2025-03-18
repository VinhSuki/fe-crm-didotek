/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import customerApi from "@/apis/modules/customer.api";
import distributorApi from "@/apis/modules/distributor.api";
import employeeApi from "@/apis/modules/employee.api";
import importWarehouseApi from "@/apis/modules/importWarehouse.api";
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
import { useWarehouseContext } from "@/context/WarehouseContext";
import {
  FilterSearch,
  IApiResponse,
  ICustomer,
  IDistributor,
  IEmployee,
  IExportProduct,
  IGroupProduct,
  IImportProduct,
  IOption,
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
import AddExportProduct from "./ExportProduct/Add";
// import AddImportProduct from "./Product/Add";

const exportWarehouseSchema = z.object({
  ngay_xuat: z.date({
    required_error: "Vui lòng chọn ngày xuất",
  }),
  da_giao_hang: z.boolean(),
  ghi_chu: z.string(),
  gia_tri_chiet_khau: z.union([z.string(), z.number()]),
  khach_hang_id: z.string({
    required_error: "Vui lòng chọn khách hàng",
  }),
  loai_chiet_Khau: z.union([z.string(), z.number()]),
  loi_nhuan: z.union([z.string(), z.number()]),
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
  ds_san_pham_xuat: z
    .array(
      z.object({
        chiet_khau: z.union([z.string(), z.number()]),
        ctsp_id: z.union([z.string(), z.number()]),
        don_vi_tinh: z.string(),
        gia_ban: z.union([z.string(), z.number()]),
        la_qua_tang: z.boolean(),
        san_pham_id: z.union([z.string(), z.number()]),
        so_luong_ban: z.union([z.string(), z.number()]),
        thanh_tien: z.union([z.string(), z.number()]),
        ds_sku: z.array(
          z.object({
            sku: z.string(),
            so_luong_ban: z.union([z.string(), z.number()]),
            gia_nhap: z.union([z.string(), z.number()]),
          })
        ),
      })
    )
    .min(1, "Vui lòng thêm ít nhất 1 sản phẩm"),
});
type ExportWarehouseFormValues = z.infer<typeof exportWarehouseSchema>;

const Add = () => {
  const [listImportProduct, setListImportProduct] = useState<IImportProduct[]>(
    []
  );
  const form = useForm({
    resolver: zodResolver(exportWarehouseSchema),
    defaultValues: {
      ngay_xuat: new Date(), // Ngày xuất mặc định là hôm nay
      da_giao_hang: false, // Mặc định là chưa giao hàng
      ghi_chu: "", // Ghi chú trống
      gia_tri_chiet_khau: "0", // Giảm giá mặc định là 0
      loai_chiet_Khau: "0", // Loại chiết khấu mặc định là 0
      loi_nhuan: "0", // Lợi nhuận mặc định là 0
      thanh_tien: "0", // Thành tiền mặc định là 0
      tong_tien: "0", // Tổng tiền mặc định là 0
      tra_truoc: "0", // Trả trước mặc định là 0
      con_lai: "0", // Còn lại mặc định là 0
      vat: "0", // VAT mặc định là 0
      ds_san_pham_xuat: [], // Danh sách sản phẩm xuất trống ban đầu
    },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sidebar = useSidebarContext();

  const [toggleSubmitted, setToggleSubmitted] = useState<boolean>(false);

  const [listOptionCustomers, setListOptionCustomers] = useState<IOption[]>([]);
  const [listOptionDeliveryEmployees, setListOptionDeliveryEmployees] =
    useState<IOption[]>([]);
  const [listOptionSaleEmployees, setListOptionSalEmployees] = useState<
    IOption[]
  >([]);

  const totalMoney = form.watch("tong_tien") ?? "0";
  const convertExportWarehouse = async (data: ExportWarehouseFormValues) => {
    // Chuyển ảnh và id của ds_san_pham sang số
    const dsSanPham = await Promise.all(
      data.ds_san_pham_xuat.map(async (item) => ({
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
          ID: v.ID,
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
          { field: "chuc_vu.id", condition: "=", value: "12" },
        ]);
        await fetchApiList(employeeApi, setListOptionSalEmployees, [
          { field: "chuc_vu.id", condition: "=", value: "13" },
        ]);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getApiList();
  }, []);

  const onSubmit = async (data: ExportWarehouseFormValues) => {
    // console.log(data);
    // console.log(listDataImportProduct);
    const convertData = await convertExportWarehouse(data);
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
            if (errors.ds_san_pham_xuat) {
              const isValued = form.getValues("ds_san_pham_xuat").length > 0;
              if (isValued) {
                onSubmit(form.getValues());
              } else {
                showErrorAlert(String(errors.ds_san_pham_xuat.message));
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
                  name="nv_giao_hang"
                  label="Nhân viên giao hàng"
                  options={listOptionDeliveryEmployees}
                  placeholder="Chọn nhân viên giao hàng"
                />
                <SelectSearch
                  form={form}
                  name="nv_sale"
                  label="Nhân viên sale"
                  options={listOptionSaleEmployees}
                  placeholder="Chọn nhân viên sale"
                />
              </div>
              <Card>
                <CardHeader className="flex-row justify-between items-center border-b p-4">
                  <h3 className="text-emphasis font-bold">Sản phẩm</h3>
                  <AddExportProduct
                    isDisabled={form.getValues("khach_hang_id") === undefined}
                    onAdded={() => console.log("balbla")}
                  />
                </CardHeader>
                <CardContent className={clsx("p-4 overflow-x-auto")}>
                  {/* <ImportProductTable
                    toggleSubmitted={toggleSubmitted}
                    setListDataImportProduct={setListDataImportProduct}
                    onTotalMoneyChange={handleTotalMoneyChange}
                    listImportProduct={listImportProduct}
                    onDeleted={handleDeleteImportProduct}
                  /> */}
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
