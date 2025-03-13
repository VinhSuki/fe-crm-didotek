/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import NumericInput from "@/components/common/NumericInput";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IImportProduct } from "@/models/interfaces";
import formatVND from "@/utils/formatVND";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const productSchema = z.object({
  ds_san_pham_nhap: z.array(
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
        so_luong: z
          .string()
          .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Giá trị phải là số dương",
          }),
        upc: z.string(),
        han_su_dung: z.coerce.date(),
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
  ),
});

type productFormValues = z.infer<typeof productSchema>;
interface TableProps {
  listImportProduct: IImportProduct[];
  onDeleted: (id: string | number) => void;
  onTotalMoneyChange: (totalData: {
    id: string | number;
    total: number;
  }) => void;
}

export default function ImportProductTable({
  listImportProduct,
  onDeleted,
  onTotalMoneyChange,
}: TableProps) {
  const form = useForm<productFormValues>({
    resolver: zodResolver(productSchema), // Truyền warehouses vào schema
    defaultValues: {
      ds_san_pham_nhap: listImportProduct.map((p) => ({
        upc: p.upc,
        san_pham_id: p.san_pham_id,
        ctsp_id: p.ctsp_id,
        so_luong: p.so_luong || "0",
        gia_nhap: "0",
        gia_ban: "0",
        don_vi_tinh: p.don_vi_tinh || "",
        ke: p.ke || "",
        la_qua_tang: p.la_qua_tang || false,
        chiet_khau: p.chiet_khau || "0",
      })),
    },
  });
  const listFormImportProduct = form.watch("ds_san_pham_nhap") ?? [];
  useEffect(() => {
    if (listImportProduct.length > 0) {
      if (listImportProduct.length >= listFormImportProduct.length) {
        const lastProduct = listImportProduct[listImportProduct.length - 1];

        const updatedValue = [
          ...listFormImportProduct.filter(
            (p) => Object.values(p).some((value) => value !== undefined) // Chỉ giữ lại object có ít nhất một giá trị khác undefined
          ),
          {
            upc: lastProduct.upc || "",
            san_pham_id: lastProduct.san_pham_id,
            ctsp_id: lastProduct.ctsp_id,
            so_luong: lastProduct.so_luong || "0",
            gia_nhap: "0",
            gia_ban: "0",
            don_vi_tinh: lastProduct.don_vi_tinh || "",
            ke: lastProduct.ke || "",
            la_qua_tang: lastProduct.la_qua_tang ?? false,
            chiet_khau: lastProduct.chiet_khau || "0",
            han_su_dung: lastProduct.han_su_dung
              ? new Date(lastProduct.han_su_dung)
              : new Date(), // Nếu không có thì lấy ngày hiện tại
          },
        ];
        form.setValue("ds_san_pham_nhap", updatedValue);
      } else {
        const updatedValue = listFormImportProduct.filter((p) =>
          listImportProduct.some((ip) => ip.ctsp_id === p.ctsp_id)
        );
        form.setValue("ds_san_pham_nhap", updatedValue);
      }
    } else {
      form.setValue("ds_san_pham_nhap", []);
    }
  }, [listImportProduct]);
  // const handleToggleCheckbox = (index: number) => {};

  // const [listValueCheckbox, setListValueCheckbox] = useState<
  //   {
  //     isChecked: boolean;
  //     gia_nhap: string;
  //     gia_ban: string;
  //     chiet_khau: string;
  //   }[]
  // >([]);
  // useEffect(() => {
  //   setListValueCheckbox((prev) => [
  //     ...prev,
  //     {
  //       isChecked: false,
  //       gia_nhap: listImportProduct[listImportProduct.length - 1].gia_nhap,
  //       gia_ban: listImportProduct[listImportProduct.length - 1].gia_ban,
  //       chiet_khau: listImportProduct[listImportProduct.length - 1].chiet_khau,
  //     },
  //   ]);
  // }, [listImportProduct]);

  const getTotalMoney = (index: number) => {
    if (
      listFormImportProduct.length > 0 &&
      index < listFormImportProduct.length
    ) {
      const total =
        Number(listFormImportProduct[index].gia_nhap ?? 0) *
        Number(listFormImportProduct[index].so_luong ?? 0) *
        (1 - Number(listFormImportProduct[index].chiet_khau ?? 0) / 100);
      onTotalMoneyChange({ id: listFormImportProduct[index].ctsp_id, total });
      return formatVND(total);
    }
    return;
  };

  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      await onDeleted(id);
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi

  return (
    <>
      {listImportProduct.length === 0 ? (
        <div className="text-center text-zinc-500 text-lg">Chưa có dữ liệu</div>
      ) : (
        <Form {...form}>
          <Table className="overflow-x-auto w-full">
            <TableHeader>
              <TableRow>
                <TableHead className={clsx("whitespace-nowrap min-w-[50px]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Mã SP</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap min-w-[100px]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Tên SP</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap min-w-[200px]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Hạn sử dụng</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap min-w-[100px]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Đơn vị tính</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap min-w-[150px]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Số lượng</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap min-w-[150px]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Kệ</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap min-w-[150px]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Giá nhập</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap min-w-[150px]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Giá bán</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap min-w-[150px]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Chiết khấu</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap min-w-[200px]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Thành tiền</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Quà tặng</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap")}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Dữ liệu */}
              {listImportProduct.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.upc}</TableCell>
                  <TableCell>{row.ctsp_ten}</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`ds_san_pham_nhap.${index}.han_su_dung`}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`ds_san_pham_nhap.${index}.don_vi_tinh`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly
                              className="bg-zinc-100 cursor-default"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`ds_san_pham_nhap.${index}.so_luong`}
                      render={({ field }) => (
                        <FormItem>
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
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`ds_san_pham_nhap.${index}.ke`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`ds_san_pham_nhap.${index}.gia_nhap`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <NumericInput
                              // eslint-disable-next-line no-constant-binary-expression
                              max={
                                listFormImportProduct[index]?.gia_ban
                                  ? Number(
                                      listFormImportProduct[index]?.gia_ban
                                    )
                                  : undefined
                              }
                              min={0}
                              value={formatVND(field.value ?? "0")}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`ds_san_pham_nhap.${index}.gia_ban`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <NumericInput
                              min={
                                listFormImportProduct[index]?.gia_nhap
                                  ? Number(
                                      listFormImportProduct[index]?.gia_nhap
                                    )
                                  : undefined
                              }
                              value={formatVND(field.value ?? "0")}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`ds_san_pham_nhap.${index}.chiet_khau`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <NumericInput
                              min={0}
                              max={99}
                              value={formatVND(field.value ?? "0")}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      readOnly
                      className="bg-zinc-100 cursor-default"
                      type="text"
                      value={getTotalMoney(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`ds_san_pham_nhap.${index}.la_qua_tang`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <ConfirmDeleteButton
                      id={row.san_pham_id + ":" + row.ctsp_id}
                      onConfirm={onConfirmDelete}
                      title={`Bạn có chắc chắn muốn xóa sản phẩm ${row.ctsp_ten}?`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Form>
      )}
    </>
  );
}
