/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import productApi from "@/apis/modules/product.api";
import stockApi from "@/apis/modules/stock.api";
import NumericInput from "@/components/common/NumericInput";
import SelectGroupSearch from "@/components/common/SelectGroupSearch";
import SelectSearch from "@/components/common/SelectSearch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  IExportProduct,
  IGroupProduct,
  IOption,
  IProduct,
  ISku,
  IStock
} from "@/models/interfaces";
import SkuTable from "@/pages/WarehouseManagement/ExportWarehouse/ExportProduct/SkuTable";
import { convertRFC1123 } from "@/utils/convertRFC1123";
import formatVND from "@/utils/formatVND";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const productSchema = z.object({
  san_pham: z.string(),
  chiet_khau: z.union([z.string(), z.number()]),
  chiet_khau_vnd: z.union([z.string(), z.number()]),
  san_pham_ten: z.string(),
  san_pham_id: z.union([z.string(), z.number()]),
  ctsp_id: z.union([z.string(), z.number()]),
  ctsp_ten: z.string(),
  la_qua_tang: z.boolean(),
  so_luong_ban: z.union([z.string(), z.number()]),
  sku: z.string(),
  gia_ban: z.union([z.string(), z.number()]),
  don_vi_tinh: z.string(),
  upc: z.string(),
  ds_sku: z.array(
    z.object({
      sku: z.string(),
      han_su_dung: z.union([z.coerce.date(), z.string()]),
      don_vi_tinh: z.string(),
      so_luong_ton: z.union([z.string(), z.number()]),
      so_luong_ban: z.union([z.string(), z.number()]),
      gia_ban_truoc: z.union([z.string(), z.number()]),
    })
  ),
});

type SkuFormValues = z.infer<typeof productSchema>;

export default function Add({
  isDisabled,
  onAdded,
  listExportProducts,
}: {
  isDisabled: boolean;
  onAdded: (data: IExportProduct) => void;
  listExportProducts: IExportProduct[];
}) {
  const [toggleSubmitted, setToggleSubmitted] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const form = useForm<SkuFormValues>({
    resolver: zodResolver(productSchema), // Truyền warehouses vào schema
    defaultValues: {
      chiet_khau: "0",
      la_qua_tang: false,
      so_luong_ban: "0",
      gia_ban: "0",
    },
  });
  const [listProducts, setListProducts] = useState<IProduct[]>([]);
  const [listGroupProduct, setListGroupProduct] = useState<IGroupProduct[]>([]);
  const [listOptionSku, setListOptionSku] = useState<IOption[]>([]);
  const [listSku, setListSku] = useState<ISku[]>([]);
  const [listStock, setListStock] = useState<IStock[]>([]);
  const [valueCheckbox, setValueCheckbox] = useState<{
    gia_ban: string | number;
    chiet_khau: string | number;
  }>();

  const product = form.watch("san_pham");
  const sku = form.watch("sku");
  const handleTotalQuantity = (total: number) => {
    form.setValue("so_luong_ban", total);
  };
  const setListDataSku = (data: ISku[]) => {
    if (data.length > 0) {
      form.setValue("ds_sku", data);
      handleSubmit();
    }
  };
  const handleDeleteSku = async (sku: number | string) => {
    const stockDetail: IStock | undefined = listStock.find(
      (st) => st.sku === sku
    );
    const newListSku = listSku.filter((p) => p.sku !== sku);
    setListSku(newListSku);
    if (stockDetail) {
      setListOptionSku((prev) =>
        [
          ...prev,
          {
            ID: stockDetail.sku ?? "",
            ten: `${stockDetail.sku} (SL:${stockDetail.so_luong_ton} - HSD:${
              convertRFC1123(String(stockDetail.han_su_dung)) ?? "Không có"
            })`,
          },
        ].sort((a, b) => Number(a.ID) - Number(b.ID))
      );
    }
  };
  useEffect(() => {
    const isChecked = form.getValues("la_qua_tang");
    if (isChecked) {
      setValueCheckbox({
        gia_ban: form.getValues("gia_ban") ?? "0",
        chiet_khau: form.getValues("chiet_khau") ?? "0",
      });
      form.setValue("chiet_khau", "0");
      form.setValue("gia_ban", "0");
    } else {
      form.setValue("chiet_khau", String(valueCheckbox?.chiet_khau ?? "0"));
      form.setValue("gia_ban", String(valueCheckbox?.gia_ban ?? "0"));
    }
  }, [form.watch("la_qua_tang")]);
  useEffect(() => {
    if (
      Number(form.getValues("so_luong_ban")) > 0 &&
      Number(form.getValues("gia_ban")) > 0 &&
      Number(form.getValues("chiet_khau")) > 0
    ) {
      const total =
        Number(form.getValues("gia_ban")) *
        Number(form.getValues("so_luong_ban")) *
        (Number(form.getValues("chiet_khau")) / 100);
      form.setValue("chiet_khau_vnd", String(total));
    } else {
      form.setValue("chiet_khau_vnd", "0");
    }
  }, [
    form.watch("chiet_khau"),
    form.watch("so_luong_ban"),
    form.watch("gia_ban"),
  ]);
  useEffect(() => {
    const fetchApi = async () => {
      const [groupId, itemId] = product.split(":");
      const group = listGroupProduct.find((p) => String(p.groupId) === groupId);
      const productDetail = group!.items.find((i) => String(i.ID) === itemId);
      const res = await stockApi.detail(itemId);
      const data = res.data?.data;
      if (data) {
        const list: IOption[] = [];
        const exportSkus = new Set(
          listExportProducts.flatMap((product) =>
            product.ds_sku.map((skuItem) => skuItem.sku)
          )
        );
        const validData = data.filter((sp) => !exportSkus.has(sp.sku ?? ""));
        list.push(
          ...validData.map((sp) => ({
            ID: sp.sku ?? "",
            ten: `${sp.sku} (SL:${sp.so_luong_ton} - HSD:${
              convertRFC1123(String(sp.han_su_dung)) ?? "Không có"
            })`,
          }))
        );

        setListOptionSku(list);
        setListStock(data);
        setListSku([]);
        form.setValue("sku", "");
        form.setValue("san_pham_id", groupId);
        if (productDetail && group) {
          form.setValue("ctsp_ten", group.group + "-" + productDetail.ten);
          form.setValue("ctsp_id", productDetail.ID);
          form.setValue("don_vi_tinh", productDetail.don_vi_tinh);
          form.setValue("upc", productDetail.upc);
        }
      }
    };
    if (product) fetchApi();
  }, [product]);
  useEffect(() => {
    const list: IOption[] = [];
    const exportSkus = new Set(
      listExportProducts.flatMap((product) =>
        product.ds_sku.map((skuItem) => skuItem.sku)
      )
    );
    const validData = listStock.filter((sp) => !exportSkus.has(sp.sku ?? ""));
    list.push(
      ...validData.map((sp) => ({
        ID: sp.sku ?? "",
        ten: `${sp.sku} (SL:${sp.so_luong_ton} - HSD:${
          convertRFC1123(String(sp.han_su_dung)) ?? "Không có"
        })`,
      }))
    );

    setListOptionSku(list);
  }, [listExportProducts]);
  useEffect(() => {
    if (sku) {
      const stockDetail: IStock | undefined = listStock.find(
        (st) => st.sku === sku
      );
      setListSku((prev) => [
        ...prev,
        {
          sku,
          han_su_dung: stockDetail?.han_su_dung ?? "",
          don_vi_tinh: stockDetail?.don_vi_tinh ?? "",
          so_luong_ton: stockDetail?.so_luong_ton ?? "1",
          so_luong_ban: "1",
          gia_ban_truoc: stockDetail?.gia_ban ?? "1",
        },
      ]);
      setListOptionSku(listOptionSku.filter((el) => el.ID !== sku));
      form.setValue("sku", "");
    }
  }, [sku]);
  useEffect(() => {
    const fetchApi = async () => {
      if (!listProducts.length) return;

      let list: IGroupProduct[] = [];

      // Sử dụng map + Promise.all để chờ tất cả các request
      const results = await Promise.all(
        listProducts.map(async (element) => {
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
  }, [listProducts]);
  useEffect(() => {
    const fetchApi = async () => {
      const res = await productApi.list({});
      if (res.data?.data) {
        setListProducts(res.data.data);
      }
    };
    if (!isDisabled) fetchApi();
  }, [isDisabled]);
  const handleCheckError = async () => {
    if (!form.getValues("san_pham")) {
      form.setError("san_pham", { message: "Vui lòng thêm sản phẩm" });
      return;
    } else {
      form.clearErrors("san_pham");
    }
    if (Number(form.getValues("so_luong_ban")) === 0) {
      form.setError("sku", { message: "Vui lòng thêm lô hàng" });
      return;
    } else {
      form.clearErrors("sku");
    }
    setToggleSubmitted(!toggleSubmitted);
  };

  const handleSubmit = async () => {
    const data = form.getValues();
    const convertData = {
      san_pham_id: Number(data.san_pham_id),
      ctsp_id: Number(data.ctsp_id),
      ctsp_ten: data.ctsp_ten,
      so_luong_ban: Number(data.so_luong_ban),
      don_vi_tinh: data.don_vi_tinh,
      upc: data.upc,
      gia_ban: Number(data.gia_ban),
      chiet_khau: Number(data.chiet_khau),
      la_qua_tang: data.la_qua_tang,
      thanh_tien_truoc_chiet_khau:
        Number(data.gia_ban) * Number(data.so_luong_ban),
      thanh_tien:
        Number(data.gia_ban) *
        Number(data.so_luong_ban) *
        (1 - Number(data.chiet_khau) / 100),
      ds_sku: data.ds_sku.map((el) => ({
        sku: el.sku,
        so_luong_ban: Number(el.so_luong_ban),
        gia_ban_truoc: Number(el.gia_ban_truoc),
      })),
    };
    onAdded(convertData);
    setOpen(false);
    form.reset();
    setListSku([]);
    setListOptionSku([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="bg-primary hover:bg-secondary text-white"
          disabled={isDisabled}
        >
          <Plus />
          <span>Thêm mới</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] !aria-hidden:false">
        <DialogHeader>
          <DialogTitle className="border-b pb-4">Thêm sản phẩm</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="grid gap-4">
            <SelectGroupSearch
              form={form}
              name="san_pham"
              label="Chọn sản phẩm"
              options={listGroupProduct}
            />
            <SelectSearch
              form={form}
              name="sku"
              label="Lô hàng"
              options={listOptionSku}
            />
            <SkuTable
              onTotalQuantity={handleTotalQuantity}
              listSku={listSku}
              toggleSubmitted={toggleSubmitted}
              setListDataSku={setListDataSku}
              onDeleted={handleDeleteSku}
            />
            <div className="flex justify-between">
              <FormField
                control={form.control}
                name={"gia_ban"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá bán</FormLabel>
                    <FormControl>
                      <NumericInput
                        disabled={form.getValues("la_qua_tang")}
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
                name={"chiet_khau"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiết khấu (%)</FormLabel>
                    <FormControl>
                      <NumericInput
                        disabled={form.getValues("la_qua_tang")}
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
                name={"chiet_khau_vnd"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiết khấu (VND)</FormLabel>
                    <FormControl>
                      <NumericInput
                        readOnly
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
                name={"la_qua_tang"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quà tặng</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center">
                        <Checkbox
                          className="block"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter className="space-x-2">
            <Button
              type="button"
              className="bg-black/80 hover:bg-black"
              onClick={() => setOpen(false)}
            >
              Đóng
            </Button>
            <Button type="button" onClick={handleCheckError}>
              Lưu
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
