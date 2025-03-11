/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AddProduct from "./Product/Add";
import distributorApi from "@/apis/modules/distributor.api";
import productApi from "@/apis/modules/product.api";
import PaginationCustom from "@/components/common/PaginationCustom";
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
import { PAGINATION } from "@/constant";
import { IDistributor, IProduct } from "@/models/interfaces";
import ProductDistributorTable from "@/pages/PartnerManagement/Distributor/Product/Table";
import { showSuccessAlert } from "@/utils/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDown, CircleAlert, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

const distributorSchema = z.object({
  id: z.union([z.string(), z.number()]),
  ten: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
  email: z.string().min(1, "Vui lòng nhập email").email(),
  dien_thoai: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(
      new RegExp("^(03|05|07|08|09|01[2|6|8|9])\\d{8}$"),
      "Số điện thoại không hợp lệ"
    ),
  dia_chi: z.string().min(1, "Vui lòng nhập họ và tên"),
  ds_san_pham: z.array(z.union([z.number(), z.string()])),
});

type DistributorFormValues = z.infer<typeof distributorSchema>;

export default function Edit() {
  const params = useParams();
  const distributorId = params.distributorId;
  const [listProduct, setListProduct] = useState<IProduct[]>([]);
  const [listProductAdded, setListProductAdded] = useState<IProduct[]>([]);
  const [distributor, setDistributor] = useState<IDistributor>(Object);
  useEffect(() => {
    const getApi = async () => {
      const resListProduct = await productApi.list({});
      const resDistributorDetail = await distributorApi.list({
        filters: [
          { field: "nha_phan_phoi.id", condition: "=", value: distributorId },
        ],
      });
      if (resDistributorDetail.data?.data) {
        setDistributor(resDistributorDetail.data.data[0]);
        setListProductAdded(resDistributorDetail.data.data[0].ds_san_pham);
      }
      if (resListProduct.data?.data && resDistributorDetail.data?.data) {
        const distributorProducts =
          resDistributorDetail.data.data[0]?.ds_san_pham || []; 
        setListProduct(
          resListProduct.data.data.filter(
            (p) =>
              !distributorProducts.some((dp) => Number(dp.ID) === Number(p.ID))
          )
        );
      }
    };
    getApi();
  }, [distributorId]);
  useEffect(() => {}, [distributorId]);

  useEffect(() => {
    form.reset({
      id: distributor.ID,
      dia_chi: distributor.dia_chi,
      email: distributor.email,
      dien_thoai: distributor.dien_thoai,
      ten: distributor.ten,
      ds_san_pham: [],
    });
  }, [distributor]);
  const form = useForm<DistributorFormValues>({
    resolver: zodResolver(distributorSchema), // Truyền productTypes vào schema
  });

  const [pagination, setPagination] = useState({
    currentPage: PAGINATION.DEFAULT_PAGE,
    totalPage: 0,
  });
  const convertDistributorData = async (data: DistributorFormValues) => {
    // Chuyển ảnh và id của ds_san_pham sang số
    const dsSanPham = await Promise.all(
      listProductAdded.map(async (item) => Number(item.ID))
    );

    return {
      ...data,
      ds_san_pham: dsSanPham,
    };
  };

  useEffect(() => {
    const totalPage = Math.ceil(
      listProductAdded.length / PAGINATION.DEFAULT_LIMIT
    );
    setPagination((prev) => ({
      ...prev,
      totalPage,
      currentPage: Math.min(prev.currentPage, totalPage) || 1, // Đảm bảo currentPage hợp lệ
    }));
  }, [listProductAdded]);
  const navigate = useNavigate();
  const handleAddProduct = (data: { id: string | number }) => {
    const productFind = listProduct.find(
      (p) => Number(p.ID) === Number(data.id)
    );

    if (!productFind) return;

    setListProductAdded((prev) => {
      const newAddedOptions = [...prev, productFind];

      // Tính tổng số sản phẩm sau khi thêm
      const totalProducts = newAddedOptions.length;

      // Xác định trang chứa sản phẩm vừa thêm
      const newCurrentPage = Math.ceil(
        totalProducts / PAGINATION.DEFAULT_LIMIT
      );

      setPagination((prev) => ({ ...prev, currentPage: newCurrentPage }));

      return newAddedOptions;
    });

    // Loại bỏ sản phẩm khỏi danh sách có thể thêm
    setListProduct((prev) =>
      prev.filter((p) => Number(p.ID) !== Number(data.id))
    );
  };

  const handleDeleteProduct = async (id: number | string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const productFind = listProductAdded.find(
          (p) => Number(p.ID) === Number(id)
        );
        const newProductList = listProductAdded.filter(
          (p) => Number(p.ID) !== Number(id)
        );
        setListProductAdded(newProductList);

        if (productFind) {
          setListProduct((prev) =>
            [...prev, productFind].sort((a, b) => Number(a.ID) - Number(b.ID))
          );
        }

        const totalPage = Math.ceil(
          newProductList.length / PAGINATION.DEFAULT_LIMIT
        );
        const newCurrentPage = Math.min(pagination.currentPage, totalPage) || 1;

        setPagination((prev) => ({
          ...prev,
          totalPage,
          currentPage: newCurrentPage,
        }));

        resolve();
      }, 500);
    });
  };
  const onSubmit = async (data: DistributorFormValues) => {
    const convertData = await convertDistributorData(data);
    console.log(convertData);
    try {
      await distributorApi.edit(convertData);
      showSuccessAlert("Thêm dữ liệu thành công!");
      navigate("/nha-phan-phoi");
    } catch (error: any) {
      form.setError("ten", { type: "manual", message: error.message });
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          noValidate={true}
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
                      <span className="font-bold">Thông tin nhà phân phối</span>
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
                          <FormLabel>Tên(*)</FormLabel>
                          <FormControl>
                            <Input {...field} autoComplete="off" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dia_chi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ (*)</FormLabel>
                          <FormControl>
                            <Input {...field} autoComplete="off" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dien_thoai"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Điện thoại (*)</FormLabel>
                          <FormControl>
                            <Input {...field} autoComplete="off" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (*)</FormLabel>
                          <FormControl>
                            <Input {...field} autoComplete="off" type="email" />
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
                      <span className="font-bold">Danh sách sản phẩm</span>
                    </div>
                    <ChevronDown />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="w-full">
                  <div className="p-4 bg-white border w-full rounded-b-md space-y-4">
                    <div className="flex justify-end">
                      <AddProduct
                        products={listProduct}
                        onAdded={handleAddProduct}
                      />
                    </div>
                    <ProductDistributorTable
                      products={listProductAdded.slice(
                        (pagination.currentPage - 1) * PAGINATION.DEFAULT_LIMIT,
                        pagination.currentPage * PAGINATION.DEFAULT_LIMIT
                      )}
                      onDeleted={handleDeleteProduct}
                    />
                    <PaginationCustom
                      currentPage={pagination.currentPage}
                      totalPage={pagination.totalPage}
                      onPageChange={(page) =>
                        setPagination({
                          ...pagination,
                          currentPage: page,
                        })
                      }
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
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
}
