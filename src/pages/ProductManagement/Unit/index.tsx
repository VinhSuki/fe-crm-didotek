import unitApi from "@/apis/modules/unit.api";
import Loader from "@/components/common/Loader";
import PaginationCustom from "@/components/common/PaginationCustom";
import UnitTable from "@/components/common/Table/UnitTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ESortOrderValue } from "@/models/enums/option";
import Add from "@/pages/ProductManagement/Unit/Add";
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

const ENTITY_KEY = "unit"; // Định danh động

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: units = [],
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
      console.log("Da vao");
      dispatch(fetchDynamicData({ key: ENTITY_KEY, api: unitApi }));
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
    <div className="space-y-6 relative">
      {/* Product Table */}
      <Card>
        <CardHeader className="flex-row justify-end items-center border-b">
          <Add onAdded={() => dispatch(toggleReset(ENTITY_KEY))} />
        </CardHeader>
        <CardContent className="p-4">
          <UnitTable
            onEdited={() => dispatch(toggleReset(ENTITY_KEY))}
            onDeleted={() => dispatch(toggleReset(ENTITY_KEY))}
            units={units} // Dữ liệu lấy từ Redux
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
