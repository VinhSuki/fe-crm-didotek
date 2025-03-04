  import productApi from "@/apis/modules/product.api";
import Loader from "@/components/common/Loader";
import PaginationCustom from "@/components/common/PaginationCustom";
import ProductTable from "@/components/common/Table/ProductTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ESortOrderValue } from "@/models/enums/option";
import Add from "@/pages/ProductManagement/WarrantyTime/Add";
import {
  fetchDynamicData,
  initState,
  setFilters,
  setPagination,
  setSortOrder,
  toggleReset,
} from "@/redux/slices/genericPage.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ENTITY_KEY = "product"; // Định danh động

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: products = [],
    filters = [],
    pagination = { currentPage: 1, totalPage: 0 },
    sortOrder = { sort: "", order: ESortOrderValue.ASC },
    isLoading = false,
    isReset,
    isInitialized,
  } = useSelector((state: RootState) => state.genericPage[ENTITY_KEY] || {});

  useEffect(() => {
    dispatch(initState(ENTITY_KEY));
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized) {
      // 🆕 Chỉ gọi API khi đã khởi tạo
      dispatch(fetchDynamicData({ key: ENTITY_KEY, api: productApi }));
    }
  }, [
    dispatch,
    filters,
    sortOrder,
    pagination.currentPage,
    isReset,
    isInitialized,
  ]);

  return (
    <div className="space-y-6 relative w-full">
      {/* Product Table */}
      <Card className="w-full">
        <CardHeader className="flex-row justify-end items-center border-b">
          <Add onAdded={() => dispatch(toggleReset(ENTITY_KEY))} />
        </CardHeader>
        <CardContent className="p-4 max-w-[1200px] overflow-x-auto">
          <ProductTable
            onEdited={() => dispatch(toggleReset(ENTITY_KEY))}
            onDeleted={() => dispatch(toggleReset(ENTITY_KEY))}
            products={products} // Dữ liệu lấy từ Redux
            filters={filters}
            sortOrder={sortOrder}
            onFilterChange={(newFilters) =>
              dispatch(setFilters({ key: ENTITY_KEY, filters: newFilters }))
            }
            onSortOrder={(sortOrder) =>
              dispatch(setSortOrder({ key: ENTITY_KEY, sortOrder }))
            }
          />
        </CardContent>
      </Card>
      <PaginationCustom
        currentPage={pagination.currentPage}
        totalPage={pagination.totalPage}
        onPageChange={(page) =>
          dispatch(
            setPagination({
              key: ENTITY_KEY,
              pagination: { ...pagination, currentPage: page },
            })
          )
        }
      />
      {isLoading && <Loader type="inside" />}
    </div>
  );
}
