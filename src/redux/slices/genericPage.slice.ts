/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IApiResponse, FilterSearch, ISortOrder } from "@/models/interfaces";
import { IPagination } from "@/models/interfaces/pagination";
import { ESortOrderValue } from "@/models/enums/option";
import { PAGINATION } from "@/constant";

// Interface chung cho tất cả các danh mục
interface DynamicState<T> {
  data: T[];
  filters: FilterSearch[];
  sortOrder: ISortOrder<T>;
  pagination: IPagination;
  isLoading: boolean;
  isReset: boolean;
}

// Hàm khởi tạo state động
const createDynamicInitialState = <T>(): DynamicState<T> => ({
  data: [],
  filters: [],
  sortOrder: { sort: "", order: ESortOrderValue.ASC },
  pagination: { currentPage: PAGINATION.DEFAULT_PAGE, totalPage: 0 },
  isLoading: false,
  isReset: false,
});

// Async thunk để fetch dữ liệu động
export const fetchDynamicData = createAsyncThunk(
  "dynamic/fetchData",
  async ({ key, api }: { key: string; api: any }, { getState }) => {
    const state = getState() as RootState;
    const entityState = state.genericPage[key] as DynamicState<any>;

    const params = {
      page: entityState.pagination.currentPage,
      limit: PAGINATION.DEFAULT_LIMIT,
      filters: entityState.filters,
      sort: entityState.sortOrder.sort,
      order: entityState.sortOrder.order,
    };

    const res: IApiResponse<any[]> = await api.list(params);
    return { key, data: res.data };
  }
);

const genericPage = createSlice({
  name: "dynamic",
  initialState: {} as Record<string, DynamicState<any>>,
  reducers: {
    setFilters: (state, action: PayloadAction<{ key: string; filters: FilterSearch[] }>) => {
      state[action.payload.key].filters = action.payload.filters;
    },
    setSortOrder: (state, action: PayloadAction<{ key: string; sortOrder: ISortOrder<any> }>) => {
      state[action.payload.key].sortOrder = action.payload.sortOrder;
    },
    setPagination: (state, action: PayloadAction<{ key: string; pagination: IPagination }>) => {
      state[action.payload.key].pagination = action.payload.pagination;
    },
    toggleReset: (state, action: PayloadAction<string>) => {
      state[action.payload].isReset = !state[action.payload].isReset;
    },
    initState: (state, action: PayloadAction<string>) => {
      if (!state[action.payload]) {
        state[action.payload] = createDynamicInitialState();
      }
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
        state[key].pagination.totalPage = data.total_page;
      }
    });
    builder.addCase(fetchDynamicData.rejected, (state, action) => {
      const key = action.meta.arg.key;
      state[key].isLoading = false;
    });
  },
});

export const { setFilters, setSortOrder, setPagination, toggleReset, initState } = genericPage.actions;
export default genericPage.reducer;
