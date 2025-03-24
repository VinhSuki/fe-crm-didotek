/* eslint-disable @typescript-eslint/no-explicit-any */
import { PAGINATION } from "@/constant";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, ISortOrder } from "@/models/interfaces";
import { IPagination } from "@/models/interfaces";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Interface chung cho tất cả các danh mục
interface DynamicState<T> {
  data: T[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<T>;
  pagination: IPagination;
  isLoading: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  isAdded: boolean;
  isLocked: boolean;
  isReturned: boolean;
  isInitialized: boolean; // 🆕 Thêm trạng thái khởi tạo
}

// Hàm khởi tạo state động
const createDynamicInitialState = <T>(): DynamicState<T> => ({
  data: [],
  filters: [],
  sortOrder: { sort: "", order: ESortOrderValue.ASC },
  pagination: { currentPage: PAGINATION.DEFAULT_PAGE, totalPage: 0 },
  isLoading: false,
  isDeleted: false,
  isAdded: false,
  isEdited: false,
  isLocked:false,
  isReturned:false,
  isInitialized: false, // 🆕 Ban đầu chưa khởi tạo
});

// Async thunk để fetch dữ liệu động
export const fetchDynamicData = createAsyncThunk(
  "dynamic/fetchData",
  async ({ key, api }: { key: string; api: any }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const entityState = state.genericPage[key] as DynamicState<any>;
    let currentPage = entityState.pagination.currentPage;

    const params = {
      page: entityState.pagination.currentPage,
      limit: PAGINATION.DEFAULT_LIMIT,
      filters: entityState.filters,
      sort: entityState.sortOrder.sort,
      order: entityState.sortOrder.order,
    };
    const res: IApiResponse<any[]> = await api.list(params);
    // Khi xóa dữ liệu
    if (entityState.isDeleted) {
      currentPage = Math.max(
        1,
        Math.ceil((entityState.data.length - 1) / PAGINATION.DEFAULT_LIMIT)
          ? currentPage
          : currentPage - 1
      );
      dispatch(setDeleted(key));
    }
    // Khi thêm dữ liệu
    if (entityState.isAdded) {
      currentPage = Math.floor(
        (entityState.data.length + 1) / PAGINATION.DEFAULT_LIMIT
      )
        ? res.data!.total_page ?? 1
        : currentPage;
      dispatch(setAdded(key)); // Gọi action để cập nhật isAdded
    }
    if (entityState.isEdited) {
      dispatch(setEdited(key));
    }
    if (entityState.isLocked) {
      dispatch(setLocked(key));
    }
    if (entityState.isReturned) {
      dispatch(setReturned(key));
    }
    dispatch(
      setPagination({
        key,
        pagination: { ...entityState.pagination, currentPage },
      })
    );
    return { key, data: res.data };
  }
);

const genericPage = createSlice({
  name: "dynamic",
  initialState: {} as Record<string, DynamicState<any>>,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<{ key: string; filters: FilterSearch[] }>
    ) => {
      if (!state[action.payload.key]) {
        state[action.payload.key] = createDynamicInitialState();
      }
      state[action.payload.key].filters = action.payload.filters;
    },
    setSortOrder: (
      state,
      action: PayloadAction<{ key: string; sortOrder: ISortOrder<any> }>
    ) => {
      state[action.payload.key].sortOrder = action.payload.sortOrder;
    },
    setPagination: (
      state,
      action: PayloadAction<{ key: string; pagination: IPagination }>
    ) => {
      state[action.payload.key].pagination = action.payload.pagination;
    },
    setDeleted: (state, action: PayloadAction<string>) => {
      state[action.payload].isDeleted = !state[action.payload].isDeleted;
    },
    setAdded: (state, action: PayloadAction<string>) => {
      state[action.payload].isAdded = !state[action.payload].isAdded;
    },
    setEdited: (state, action: PayloadAction<string>) => {
      state[action.payload].isEdited = !state[action.payload].isEdited;
    },
    setLocked: (state, action: PayloadAction<string>) => {
      state[action.payload].isLocked = !state[action.payload].isLocked;
    },
    setReturned: (state, action: PayloadAction<string>) => {
      state[action.payload].isReturned = !state[action.payload].isReturned;
    },
    initState: (state, action: PayloadAction<string>) => {
      if (!state[action.payload]) {
        state[action.payload] = createDynamicInitialState();
      }
      state[action.payload].isInitialized = true; // 🆕 Đánh dấu là đã khởi tạo
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDynamicData.pending, (state, action) => {
      const key = action.meta.arg.key;
      state[key].isLoading = true;
    });
    builder.addCase(fetchDynamicData.fulfilled, (state, action) => {
      const { key, data } = action.payload;
      state[key].isLoading = false;
      if (data) {
        state[key].data = data.data;
        state[key].pagination.totalPage = data.total_page ?? 1;
      }
    });
    builder.addCase(fetchDynamicData.rejected, (state, action) => {
      const key = action.meta.arg.key;
      state[key].isLoading = false;
    });
  },
});

export const {
  setFilters,
  setSortOrder,
  setPagination,
  setAdded,
  setDeleted,
  setEdited,
  setLocked,
  setReturned,
  initState,
} = genericPage.actions;
export default genericPage.reducer;
