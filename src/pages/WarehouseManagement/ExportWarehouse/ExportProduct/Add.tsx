/* eslint-disable @typescript-eslint/no-explicit-any */
import importWarehouseApi from "@/apis/modules/importWarehouse.api";
import productApi from "@/apis/modules/product.api";
import GenericTable from "@/components/common/GenericTable";
import SelectGroupSearch from "@/components/common/SelectGroupSearch";
import SelectSearch from "@/components/common/SelectSearch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  IExportProduct,
  IGroupProduct,
  IImportProduct,
  IImportWarehouse,
  IOption,
  IProduct,
  ISku,
} from "@/models/interfaces";
import SkuTable from "@/pages/WarehouseManagement/ExportWarehouse/ExportProduct/SkuTable";
import { showErrorAlert, showLoadingAlert } from "@/utils/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as z from "zod";

const productSchema = z.object({
  san_pham: z.string(),
  chiet_khau: z.union([z.string(), z.number()]),
  san_pham_ten: z.string(),
  san_pham_id: z.union([z.string(), z.number()]),
  ctsp_id: z.union([z.string(), z.number()]),
  ctsp_ten: z.string(),
  la_qua_tang: z.boolean(),
  so_luong_ban: z.union([z.string(), z.number()]),
  sku: z.string(),
  ds_sku: z.array(
    z.object({
      sku: z.string(),
      so_luong_ban: z.union([z.string(), z.number()]),
      gia_nhap: z.union([z.string(), z.number()]),
    })
  ),
});

type productFormValues = z.infer<typeof productSchema>;

export default function Add({
  isDisabled,
  onAdded,
}: {
  isDisabled: boolean;
  onAdded: (data: string) => void;
}) {
  const [toggleSubmitted, setToggleSubmitted] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const form = useForm<productFormValues>({
    resolver: zodResolver(productSchema), // Truyền warehouses vào schema
  });
  const handleResetForm = () => {
    form.reset();
    setOpen(false);
  };
  const [listProducts, setListProducts] = useState<IProduct[]>([]);
  const [listGroupProduct, setListGroupProduct] = useState<IGroupProduct[]>([]);
  const [listOptionSku, setListOptionSku] = useState<IOption[]>([]);
  const [listSku, setListSku] = useState<ISku[]>([]);
  const [listImportWarehouse, setListImportWarehouse] = useState<
    IImportWarehouse[]
  >([]);

  const product = form.watch("san_pham");
  const sku = form.watch("sku");
  const setListDataSku = (data: ISku[]) => {
    if (data.length > 0) {
      form.setValue("ds_sku", data);
    }
  };
  const handleDeleteSku = async (sku: number | string) => {
    const skuDetail: IImportProduct | undefined = listImportWarehouse
      .flatMap((el) => el.ds_san_pham_nhap) // Trải mảng con thành một mảng duy nhất
      .find((p) => p.sku === sku);
    const newListSku = listSku.filter((p) => p.sku !== sku);
    setListSku(newListSku);
    if (skuDetail) {
      setListOptionSku((prev) =>
        [
          ...prev,
          {
            ID: skuDetail.sku ?? "",
            ten: `${skuDetail.sku} (SL:${skuDetail.so_luong} - HSD:${
              skuDetail.han_su_dung ?? "Không có"
            })`,
          },
        ].sort((a, b) => Number(a.ID) - Number(b.ID))
      );
    }
  };
  useEffect(() => {
    const fetchApi = async () => {
      const [groupId, itemId] = product.split(":");
      const res = await importWarehouseApi.list({
        filters: [{ field: "ctsp_id", condition: "=", value: itemId }],
      });
      const data = res.data?.data;
      if (data) {
        const list: IOption[] = [];
        data.forEach((el) => {
          if (el.ds_san_pham_nhap.length > 0) {
            list.push(
              ...el.ds_san_pham_nhap.map((sp) => ({
                ID: sp.sku ?? "",
                ten: `${sp.sku} (SL:${sp.so_luong} - HSD:${
                  sp.han_su_dung ?? "Không có"
                })`,
              }))
            );
          }
        });
        setListOptionSku(list);
        setListImportWarehouse(data);
      }
    };
    if (product) fetchApi();
  }, [product]);
  useEffect(() => {
    if (sku) {
      if (listSku.some((el) => el.sku === sku)) {
        showErrorAlert("Trùng");
      } else {
        const skuDetail: IImportProduct | undefined = listImportWarehouse
          .flatMap((el) => el.ds_san_pham_nhap) // Trải mảng con thành một mảng duy nhất
          .find((p) => p.sku === sku);
        setListSku((prev) => [
          ...prev,
          {
            sku,
            han_su_dung: skuDetail?.han_su_dung ?? "",
            don_vi_tinh: skuDetail?.don_vi_tinh ?? "",
            so_luong_ton: skuDetail?.so_luong ?? "0",
            so_luong_ban: "0",
            gia_nhap: skuDetail?.gia_nhap ?? "0",
          },
        ]);
        setListOptionSku(listOptionSku.filter((el) => el.ID !== sku));
      }
    }
  }, [sku, listImportWarehouse, listSku]);
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
  // const handleAddedProduct = (data: string) => {
  //   const [groupId, itemId] = data.split(":");
  //   const group = listGroupProduct.find((p) => String(p.groupId) === groupId);
  //   const productDetail = group!.items.find((i) => String(i.ID) === itemId);
  //   setListImportProduct((prev) => [
  //     ...prev,
  //     {
  //       san_pham_id: groupId,
  //       ctsp_id: itemId,
  //       ctsp_ten: productDetail?.ten ?? "",
  //       upc: productDetail!.upc,
  //       don_vi_tinh: productDetail!.don_vi_tinh,
  //       han_su_dung: new Date(),
  //       gia_ban: "0",
  //       gia_nhap: "0",
  //       thanh_tien: "0",
  //       chiet_khau: "0",
  //       la_qua_tang: false,
  //       so_luong: "0",
  //       ke: "",
  //     },
  //   ]);

  //   const updatedListGroupProduct = listGroupProduct.map((group) => {
  //     if (String(group.groupId) === groupId) {
  //       return {
  //         ...group,
  //         items: group.items.filter((i) => String(i.ID) !== itemId),
  //       };
  //     }
  //     return group;
  //   });

  //   setListGroupProduct(updatedListGroupProduct);
  // };
  // const handleDeleteSku = async (id: number | string) => {
  //   return new Promise<void>((resolve) => {
  //     setTimeout(() => {
  //       const [groupId, itemId] = String(id).split(":");
  //       const importProductFind = listImportProduct.find(
  //         (p) => Number(p.ctsp_id) === Number(itemId)
  //       );
  //       const newImportProductList = listImportProduct.filter(
  //         (p) => Number(p.ctsp_id) !== Number(itemId)
  //       );
  //       const newListTotalMoney = listTotalMoney.filter(
  //         (v) => String(v.id) !== itemId
  //       );
  //       setListImportProduct(newImportProductList);
  //       setListTotalMoney(newListTotalMoney);

  //       if (importProductFind) {
  //         const updatedListGroupProduct = listGroupProduct.map((group) => {
  //           if (String(group.groupId) === groupId) {
  //             return {
  //               ...group,
  //               items: [
  //                 ...group.items,
  //                 {
  //                   ID: importProductFind.ctsp_id,
  //                   ten: importProductFind.ctsp_ten ?? "",
  //                   upc: importProductFind.upc,
  //                   don_vi_tinh: importProductFind.don_vi_tinh,
  //                 },
  //               ].sort((a, b) => Number(a.ID) - Number(b.ID)),
  //             };
  //           }
  //           return group;
  //         });

  //         setListGroupProduct(updatedListGroupProduct);
  //       }

  //       resolve();
  //     }, 500);
  //   });
  // };

  const onSubmit = async (data: productFormValues) => {
    try {
      // console.log(data.san_pham);
      onAdded(data.san_pham);
      handleResetForm();
    } catch (error: any) {
      //   setError("ten", { type: "manual", message: error.message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
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
              listSku={listSku}
              toggleSubmitted={toggleSubmitted}
              setListDataSku={setListDataSku}
              onDeleted={handleDeleteSku}
            />
          </div>
          <DialogFooter className="space-x-2">
            <Button
              type="button"
              className="bg-black/80 hover:bg-black"
              onClick={handleResetForm}
            >
              Đóng
            </Button>
            <Button type="button" onClick={form.handleSubmit(onSubmit)}>
              Lưu
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
