import productApi from "@/apis/modules/product.api";
import Loader from "@/components/common/Loader";
import PaginationCustom from "@/components/common/PaginationCustom";
import ProductTable from "@/components/common/Table/ProductTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSidebarContext } from "@/context/SidebarContext";
import { ESortOrderValue } from "@/models/enums/option";
import {
  fetchDynamicData,
  initState,
  setAdded,
  setDeleted,
  setFilters,
  setPagination,
  setSortOrder
} from "@/redux/slices/genericPage.slice";
import { AppDispatch, RootState } from "@/redux/store";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ENTITY_KEY = "product"; // Định danh động

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: products = [],
    filters = [],
    pagination = { currentPage: 1, totalPage: 0 },
    sortOrder = { sort: "", order: ESortOrderValue.ASC },
    isLoading = false,
    isEdited,
    isAdded,
    isDeleted,
    isInitialized,
  } = useSelector((state: RootState) => state.genericPage[ENTITY_KEY] || {});
  const sidebar = useSidebarContext();

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
    isAdded,
    isDeleted,
    isInitialized,
    isEdited,
  ]);
  return (
    <div className="space-y-6 relative w-full">
      {/* Product Table */}
      <Card className="w-full">
        <CardHeader className="flex-row justify-end items-center border-b">
          <Link to="/san-pham/them-moi">
            <Button className="bg-primary hover:bg-secondary text-white">
              <Plus />
              <span>Thêm mới</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent
          className={clsx(
            "p-4 overflow-x-auto",
            sidebar.isCollapsed ? "max-w-[1380px]" : "max-w-[1200px]"
          )}
        >
          <ProductTable
            onEdited={()=>console.log()}
            onDeleted={() => dispatch(setDeleted(ENTITY_KEY))}
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
