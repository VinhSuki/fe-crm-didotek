/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import importWarehouseApi from "@/apis/modules/importWarehouse.api";
import Loader from "@/components/common/Loader";
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
import { IImportWarehouse } from "@/models/interfaces";
import ImportProductTable from "@/pages/WarehouseManagement/ImportWarehouse/ImportProduct/Table";
import { showErrorAlert, showSuccessAlert } from "@/utils/alert";
import formatVND from "@/utils/formatVND";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
// import EditImportProduct from "./Product/Edit";

const importWarehouseSchema = z.object({
  hoa_don_id: z.union([z.string(), z.number()]),
  ngay_nhap: z.coerce.date(),
  nha_phan_phoi_id: z.string({
    required_error: "Vui lòng chọn nhà phân phối",
  }),
  ghi_chu: z.string(),
  kho_id: z.string().min(1, "Vui lòng chọn kho ở trên thanh công cụ"),
  tong_tien: z.union([z.string(), z.number()]),
  tra_truoc: z.union([z.string(), z.number()]),
  con_lai: z.union([z.string(), z.number()]),
});
type ImportWarehouseFormValues = z.infer<typeof importWarehouseSchema>;

const Edit = () => {
  const params = useParams();
  const importWarehouseId = params.importWarehouseId;
  const [importWarehouse, setImportWarehouse] =
    useState<IImportWarehouse>(Object);
  const warehouse = useWarehouseContext();
  const form = useForm({
    resolver: zodResolver(importWarehouseSchema), // Sử dụng zodResolver với schema của bạn
  });
  useEffect(() => {
    const fetchApi = async () => {
      const res = await importWarehouseApi.list({
        filters: [
          {
            field: "hoa_don_nhap_kho.id",
            condition: "=",
            value: importWarehouseId,
          },
        ],
      });
      const data = res.data?.data ?? [];
      if (data) {
        setImportWarehouse(data[0]);
      }
    };
    if (importWarehouseId) fetchApi();
  }, [importWarehouseId]);
  useEffect(() => {
    warehouse?.setSelectedId(importWarehouse.kho_id);
    form.reset({
      hoa_don_id: importWarehouse.ID,
      tong_tien: importWarehouse.tong_tien,
      tra_truoc: importWarehouse.tra_truoc,
      con_lai: importWarehouse.con_lai,
      ghi_chu: importWarehouse.ghi_chu,
      kho_id: String(importWarehouse.kho_id),
      ngay_nhap: importWarehouse.ngay_nhap
        ? new Date(importWarehouse.ngay_nhap)
        : undefined,
      nha_phan_phoi_id: String(importWarehouse.nha_phan_phoi_id),
    });
  }, [importWarehouse]);
  const navigate = useNavigate();
  const sidebar = useSidebarContext();

  const [toggleSubmitted, setToggleSubmitted] = useState<boolean>(false);
  const totalMoney = form.watch("tong_tien") ?? "0";
  const convertImportWarehouse = async (data: ImportWarehouseFormValues) => {
    return {
      hoa_don_id: Number(data.hoa_don_id),
      ngay_nhap: new Date(data.ngay_nhap).toISOString(), // Chuyển ngày thành chuỗi ISO
      ghi_chu: data.ghi_chu,
      kho_id: Number(data.kho_id),
      tong_tien: Number(data.tong_tien),
      tra_truoc: Number(data.tra_truoc),
      con_lai: Number(data.con_lai),
    };
  };
  const prepayment = form.watch("tra_truoc");
  useEffect(() => {
    form.setValue("con_lai", Number(totalMoney) - Number(prepayment));
  }, [prepayment]);

  useEffect(() => {
    form.setValue("kho_id", String(warehouse?.selectedId ?? ""));
  }, [warehouse?.selectedId]);
  const onSubmit = async (data: ImportWarehouseFormValues) => {
    // console.log(data);
    // console.log(listDataImportProduct);
    const convertData = await convertImportWarehouse(data);
    try {
      await importWarehouseApi.edit(convertData);
      showSuccessAlert("Cập nhật dữ liệu thành công!");
      navigate("/nhap-kho");
    } catch (error: any) {
      showErrorAlert(error.message);
      // form.setError("ten", { type: "manual", message: error.message });
    }
  };
  return (
    <>
      {Object.keys(importWarehouse).length > 0 ? (
        <Form {...form}>
          <form
            noValidate={true}
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log(errors);
              if (errors.kho_id) {
                showErrorAlert(String(errors.kho_id.message));
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
                    disabled={true}
                    form={form}
                    name="nha_phan_phoi_id"
                    label="Nhà phân phối"
                    options={[
                      {
                        ID: importWarehouse.nha_phan_phoi_id,
                        ten: importWarehouse.nha_phan_phoi,
                      },
                    ]}
                    placeholder="Chọn nhà phân phối"
                  />
                </div>
                <Card>
                  <CardHeader className="flex-row justify-between items-center border-b p-4">
                    <h3 className="text-emphasis font-bold">Sản phẩm</h3>
                  </CardHeader>
                  <CardContent className={clsx("p-4 overflow-x-auto")}>
                    {importWarehouse.ds_san_pham_nhap && (
                      <ImportProductTable
                        type="edit"
                        listImportProduct={importWarehouse.ds_san_pham_nhap.map(
                          (v) => ({
                            ...v,
                            han_su_dung: new Date(v.han_su_dung),
                          })
                        )}
                      />
                    )}
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
                        <Textarea
                          className="resize-none h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <div className="fixed bottom-5 right-5 space-x-2 z-50">
              <Link to={"/nhap-kho"}>
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
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Edit;
