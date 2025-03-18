/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import NumericInput from "@/components/common/NumericInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ISku } from "@/models/interfaces";
import { convertRFC1123 } from "@/utils/convertRFC1123";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SkuSchema = z.object({
  ds_sku: z.array(
    z.object({
      sku: z.string(),
      han_su_dung: z.union([z.coerce.date(), z.string()]),
      don_vi_tinh: z.string(),
      so_luong_ton: z.union([z.string(), z.number()]),
      so_luong_ban: z.union([z.string(), z.number()]),
      gia_nhap: z.union([z.string(), z.number()]),
    })
  ),
});

type SkuFormValues = z.infer<typeof SkuSchema>;
interface TableProps {
  listSku: ISku[];
  toggleSubmitted: boolean;
  setListDataSku: (data: ISku[]) => void;
  onDeleted: (id: string | number) => void;
}

export default function SkuTable({
  listSku,
  onDeleted,
  toggleSubmitted,
  setListDataSku,
}: TableProps) {
  const form = useForm<SkuFormValues>({
    resolver: zodResolver(SkuSchema), // Truyền warehouses vào schema
    defaultValues: {
      ds_sku: listSku.map((p) => ({
        sku: p.sku || "",
        han_su_dung: p.han_su_dung ?? "",
        so_luong_ton: p.so_luong_ton || "0",
        so_luong_ban: p.so_luong_ban || "0",
        don_vi_tinh: p.don_vi_tinh || "",
        gia_nhap: p.gia_nhap || "0",
      })),
    },
  });
  const listFormSku = form.watch("ds_sku") ?? [];
  useEffect(() => {
    if (listSku.length > 0) {
      if (listSku.length >= listFormSku.length) {
        const lastSku = listSku[listSku.length - 1];

        const updatedValue = [
          ...listFormSku.filter(
            (p) => Object.values(p).some((value) => value !== undefined) // Chỉ giữ lại object có ít nhất một giá trị khác undefined
          ),
          {
            so_luong_ban: lastSku.so_luong_ban || "0",
            so_luong_ton: lastSku.so_luong_ton || "0",
            gia_nhap: lastSku.gia_nhap,
            don_vi_tinh: lastSku.don_vi_tinh || "",
            han_su_dung: lastSku.han_su_dung
              ? new Date(lastSku.han_su_dung)
              : "Không có",
            sku: lastSku.sku,
          },
        ];
        form.setValue("ds_sku", updatedValue);
      } else {
        const updatedValue = listFormSku.filter((p) =>
          listSku.some((ip) => ip.sku === p.sku)
        );
        form.setValue("ds_sku", updatedValue);
      }
    } else {
      form.setValue("ds_sku", []);
    }
  }, [listSku]);

  useEffect(() => {
    setListDataSku(listFormSku);
  }, [toggleSubmitted]);
  const [listValueCheckbox, setListValueCheckbox] = useState<
    {
      gia_nhap: string | number;
      gia_ban: string | number;
      chiet_khau: string | number;
    }[]
  >([]);
  const handleToggleCheckbox = (index: number, value: boolean) => {
    if (value) {
      const importProduct = form.getValues("ds_sku")[index];
      setListValueCheckbox(
        listValueCheckbox.map((v, i) => {
          if (i === index) {
            return {
              gia_nhap: importProduct.gia_nhap,
              gia_ban: importProduct.gia_ban,
              chiet_khau: importProduct.chiet_khau,
            };
          } else {
            return v;
          }
        })
      );
      form.setValue(`ds_sku.${index}.gia_nhap`, "0");
      form.setValue(`ds_sku.${index}.gia_ban`, "0");
      form.setValue(`ds_sku.${index}.chiet_khau`, "0");
    } else {
      setListValueCheckbox(
        listValueCheckbox.map((v, i) => {
          if (i === index) {
            return {
              gia_nhap: "0",
              gia_ban: "0",
              chiet_khau: "0",
            };
          } else {
            return v;
          }
        })
      );
      form.setValue(
        `ds_sku.${index}.gia_nhap`,
        listValueCheckbox[index].gia_nhap
      );
      form.setValue(
        `ds_sku.${index}.gia_ban`,
        listValueCheckbox[index].gia_ban
      );
      form.setValue(
        `ds_sku.${index}.chiet_khau`,
        listValueCheckbox[index].chiet_khau
      );
    }
  };

  // useEffect(() => {
  //   if (listFormSku.length > 0) {
  //     setListValueCheckbox((prev) => [
  //       ...prev,
  //       {
  //         gia_nhap: listSku[listSku.length - 1].gia_nhap,
  //         gia_ban: listSku[listSku.length - 1].gia_ban,
  //         chiet_khau: listSku[listSku.length - 1].chiet_khau,
  //       },
  //     ]);
  //   }
  // }, [listSku]);

  const onConfirmDelete = useCallback(
    async (id: string | number) => {
      await onDeleted(id);
    },
    [onDeleted]
  ); // Chỉ re-create khi `onDeleted` thay đổi

  return (
    <>
      {listSku.length === 0 ? (
        <div className="text-center text-zinc-500 text-lg">Chưa có dữ liệu</div>
      ) : (
        <Form {...form}>
          <Table className="overflow-x-auto w-full">
            <TableHeader>
              <TableRow>
                <TableHead className={clsx("whitespace-nowrap ]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Lô</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap ]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Hạn sử dụng</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap ]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Đơn vị tính</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap ]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Số lượng tồn</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap ]")}>
                  <div className={`flex items-center space-x-2`}>
                    <span>Số lượng bán</span>
                  </div>
                </TableHead>
                <TableHead className={clsx("whitespace-nowrap")}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Dữ liệu */}
              {listSku.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.sku}</TableCell>
                  <TableCell>
                    {row.han_su_dung === ""
                      ? "Không có"
                      : convertRFC1123(String(row.han_su_dung))}
                  </TableCell>
                  <TableCell>{row.don_vi_tinh}</TableCell>
                  <TableCell>{row.so_luong_ton}</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`ds_sku.${index}.so_luong_ban`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <NumericInput
                              min={0}
                              max={
                                listFormSku[index]?.so_luong_ton
                                  ? Number(listFormSku[index]?.so_luong_ton)
                                  : undefined
                              }
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
                    <Button
                      type="button"
                      className={clsx("bg-red-700 hover:bg-red-800")}
                      onClick={()=>onDeleted(row.sku)}
                    >
                      <Trash2 />
                    </Button>
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
