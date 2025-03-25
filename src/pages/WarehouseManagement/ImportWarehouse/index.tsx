import importWarehouseApi from "@/apis/modules/importWarehouse.api";
import Loader from "@/components/common/Loader";
import PaginationCustom from "@/components/common/PaginationCustom";
import ImportWarehouseTable from "@/components/common/Table/ImportWarehouseTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { useSidebarContext } from "@/context/SidebarContext";
import { ESortOrderValue } from "@/models/enums/option";
import {
  fetchDynamicData,
  initState,
  setFilters,
  setLocked,
  setPagination,
  setReturned,
  setSortOrder,
} from "@/redux/slices/genericPage.slice";
import { AppDispatch, RootState } from "@/redux/store";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ENTITY_KEY = "importWarehouse"; // Định danh động

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const sidebar = useSidebarContext();
  const authMethod = useAuthContext();
  const {
    data: importWarehouses = [],
    filters = [],
    pagination = { currentPage: 1, totalPage: 0 },
    sortOrder = { sort: "", order: ESortOrderValue.ASC },
    isLoading = false,
    isEdited,
    isAdded,
    isDeleted,
    isInitialized,
    isLocked,
    isReturned,
  } = useSelector((state: RootState) => state.genericPage[ENTITY_KEY] || {});

  useEffect(() => {
    dispatch(initState(ENTITY_KEY));
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized) {
      console.log("call");
      // 🆕 Chỉ gọi API khi đã khởi tạo
      dispatch(fetchDynamicData({ key: ENTITY_KEY, api: importWarehouseApi }));
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
    isLocked,
    isReturned,
  ]);
  return (
    <div className="space-y-6 relative">
      {/* Product Table */}
      <Card>
        <CardHeader className="flex-row justify-end items-center border-b">
          {authMethod?.checkPermission("create-hoa-don-nhap-kho") && (
            <Link to="/nhap-kho/them-moi">
              <Button className="bg-primary hover:bg-secondary text-white">
                <Plus />
                <span>Thêm mới</span>
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent
          className={clsx(
            "p-4 overflow-x-auto",
            sidebar.isCollapsed ? "max-w-[1380px]" : "max-w-[1200px]"
          )}
        >
          <ImportWarehouseTable
            onReturned={() => dispatch(setReturned(ENTITY_KEY))}
            onLocked={() => dispatch(setLocked(ENTITY_KEY))}
            importWarehouses={importWarehouses} // Dữ liệu lấy từ Redux
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
