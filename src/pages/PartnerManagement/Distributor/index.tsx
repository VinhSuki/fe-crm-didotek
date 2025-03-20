import distributorApi from "@/apis/modules/distributor.api";
import Loader from "@/components/common/Loader";
import PaginationCustom from "@/components/common/PaginationCustom";
import DistributorTable from "@/components/common/Table/DistributorTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { ESortOrderValue } from "@/models/enums/option";
import {
  fetchDynamicData,
  initState,
  setDeleted,
  setEdited,
  setFilters,
  setPagination,
  setSortOrder,
} from "@/redux/slices/genericPage.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ENTITY_KEY = "distributor"; // Định danh động

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const authMethod = useAuthContext();
  const {
    data: distributors = [],
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
      dispatch(fetchDynamicData({ key: ENTITY_KEY, api: distributorApi }));
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
          {authMethod?.checkPermission("create-nha-phan-phoi") && (
            <Link to="/nha-phan-phoi/them-moi">
              <Button className="bg-primary hover:bg-secondary text-white">
                <Plus />
                <span>Thêm mới</span>
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent className="p-4">
          <DistributorTable
            onEdited={() => dispatch(setEdited(ENTITY_KEY))}
            onDeleted={() => dispatch(setDeleted(ENTITY_KEY))}
            distributors={distributors} // Dữ liệu lấy từ Redux
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
