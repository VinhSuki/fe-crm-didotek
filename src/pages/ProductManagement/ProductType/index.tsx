import productTypeApi from "@/apis/modules/productType.api";
import Loader from "@/components/common/Loader";
import PaginationCustom from "@/components/common/PaginationCustom";
import ProductTypeTable from "@/components/common/Table/ProductTypeTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ESortOrderValue } from "@/models/enums/option";
import Add from "@/pages/ProductManagement/ProductType/Add";
import {
  fetchDynamicData,
  initState,
  setAdded,
  setDeleted,
  setEdited,
  setFilters,
  setPagination,
  setSortOrder,
} from "@/redux/slices/genericPage.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ENTITY_KEY = "productType"; // Định danh động

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: productTypes = [],
    filters = [],
    pagination = { currentPage: 1, totalPage: 0 },
    sortOrder = { sort: "", order: ESortOrderValue.ASC },
    isLoading = false,
    isEdited,
    isAdded,
    isDeleted,
    isInitialized,
  } = useSelector((state: RootState) => state.genericPage[ENTITY_KEY] || {});

  useEffect(() => {
    dispatch(initState(ENTITY_KEY));
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized) {
      // 🆕 Chỉ gọi API khi đã khởi tạo
      dispatch(fetchDynamicData({ key: ENTITY_KEY, api: productTypeApi }));
    }
  }, [
    dispatch,
    filters,
    sortOrder,
    pagination.currentPage,
    isAdded,
    isDeleted,
    isInitialized,
    isEdited,
  ]);

  return (
    <div className="space-y-6 relative">
      {/* Product Table */}
      <Card>
        <CardHeader className="flex-row justify-end items-center border-b">
          <Add onAdded={() => dispatch(setAdded(ENTITY_KEY))} />
        </CardHeader>
        <CardContent className="p-4">
          <ProductTypeTable
            onEdited={() => dispatch(setEdited(ENTITY_KEY))}
            onDeleted={() => dispatch(setDeleted(ENTITY_KEY))}
            productTypes={productTypes} // Dữ liệu lấy từ Redux
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
