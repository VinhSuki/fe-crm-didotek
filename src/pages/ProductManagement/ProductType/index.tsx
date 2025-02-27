import productTypeApi from "@/apis/modules/productType";
import Loader from "@/components/common/Loader";
import PaginationCustom from "@/components/common/PaginationCustom";
import ProductTypeTable from "@/components/common/Table/ProductTypeTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IProductType, ISortOrder } from "@/models/interfaces";
import { IPagination } from "@/models/interfaces/pagination";
import Add from "@/pages/ProductManagement/ProductType/Add";
import { useEffect, useState } from "react";


const limit = 2;
export default function Index() {
  const [productTypes, setProductTypes] = useState<IProductType[]>([]);
  const [filters, setFilters] = useState<FilterSearch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1,
    totalPage: 0,
  });
  const [sortOrder, setSortOrder] = useState<ISortOrder<IProductType>>({
    sort: "",
    order: ESortOrderValue.ASC,
  });

  const handleFilterChange = (newFilters: FilterSearch[]) => {
    setFilters(newFilters);
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
      const data = {
        page,
        limit,
        filters,
        sort,
        order,
      };
      console.log(data);
      const res: IApiResponse<IProductType[]> = await productTypeApi.list(data);
      if (res.data) {
        console.log(res.data);
        setProductTypes(res.data.data);
        setPagination({ currentPage: page, totalPage: res.data.total_page });
      } else {
        // UToast(EToastOption.ERROR, res.message);
      }
    } catch (error) {
      // UToast(EToastOption.ERROR, "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    fetchData(page, limit);
  };

  useEffect(() => {
    fetchData(1, limit, filters, sortOrder.sort, sortOrder.order);
  }, [filters, sortOrder]);


  return (
    <div className="space-y-6 relative">
      {/* Product Table */}
      <Card>
        <CardHeader className="flex-row justify-end items-center border-b">
          <Add />
        </CardHeader>
        <CardContent className="p-4">
          <ProductTypeTable
            productTypes={productTypes} // Hiển thị dữ liệu đã lọc
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortOrder={(sortOrder: ISortOrder<IProductType>)=>setSortOrder(sortOrder)}
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
