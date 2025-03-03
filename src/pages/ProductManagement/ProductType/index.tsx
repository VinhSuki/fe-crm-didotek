import productTypeApi from "@/apis/modules/productType";
import Loader from "@/components/common/Loader";
import PaginationCustom from "@/components/common/PaginationCustom";
import ProductTypeTable from "@/components/common/Table/ProductTypeTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PAGINATION } from "@/constant";
import { ESortOrderValue } from "@/models/enums/option";
import {
  FilterSearch,
  IApiResponse,
  IProductType,
  ISortOrder,
} from "@/models/interfaces";
import { IPagination } from "@/models/interfaces/pagination";
import Add from "@/pages/ProductManagement/ProductType/Add";
import { useEffect, useState } from "react";

export default function Index() {
  const [productTypes, setProductTypes] = useState<IProductType[]>([]);
  const [productListTypes, setProductListTypes] = useState<IProductType[]>([]);
  const [isReset, setIsReset] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterSearch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: PAGINATION.DEFAULT_PAGE,
    totalPage: 0,
  });
  const [sortOrder, setSortOrder] = useState<ISortOrder<IProductType>>({
    sort: "",
    order: ESortOrderValue.ASC,
  });

  const handleFilterChange = (newFilters: FilterSearch[]) => {
    setFilters(newFilters);
  };
  const handleReset = () => {
    setIsReset(!isReset);
  };

  const fetchData = async (
    page: number,
    limit: number,
    filters: FilterSearch[] = [],
    sort: keyof IProductType | "" = "",
    order: ESortOrderValue = ESortOrderValue.ASC
  ) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit,
        filters,
        sort,
        order,
      };
      // console.log(params);
      const res: IApiResponse<IProductType[]> = await productTypeApi.list(params);
      if (res.data) {
        setProductTypes(res.data.data);
        setPagination({
          currentPage: res.data.data.length > 0 ? page : 1,
          totalPage: res.data.total_page,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchListData = async () => {
    try {
      const res: IApiResponse<IProductType[]> = await productTypeApi.list({});
      if (res.data) {
        setProductListTypes(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    fetchData(page, PAGINATION.DEFAULT_LIMIT);
  };

  useEffect(() => {
    fetchData(
      pagination.currentPage,
      PAGINATION.DEFAULT_LIMIT,
      filters,
      sortOrder.sort,
      sortOrder.order
    );
  }, [filters, sortOrder, isReset, pagination.currentPage]);

  useEffect(() => {
    fetchListData();
  }, [isReset]);

  return (
    <div className="space-y-6 relative">
      {/* Product Table */}
      <Card>
        <CardHeader className="flex-row justify-end items-center border-b">
          <Add productTypes={productListTypes} onAdded={handleReset} />
        </CardHeader>
        <CardContent className="p-4">
          <ProductTypeTable
          onEdited={handleReset}
            onDeleted={handleReset}
            productTypes={productTypes} // Hiển thị dữ liệu đã lọc
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortOrder={(sortOrder: ISortOrder<IProductType>) =>
              setSortOrder(sortOrder)
            }
          />
        </CardContent>
      </Card>
      <PaginationCustom
        currentPage={pagination.currentPage}
        totalPage={pagination.totalPage}
        onPageChange={handlePageChange}
      />
      {isLoading && <Loader type="inside" />}
    </div>
  );
}
