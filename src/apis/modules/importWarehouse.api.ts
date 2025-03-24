/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosPrivate from "@/apis/client/private.client";
import { ESortOrderValue } from "@/models/enums/option";
import {
  FilterSearch,
  IApiResponse,
  IImportWarehouse,
} from "@/models/interfaces";

const importWarehouseEndpoints = {
  common: "hoa-don-nhap-kho",
  lock: "hoa-don-nhap-kho/lock",
  return: "hoa-don-nhap-kho/tra-hang",
};

const importWarehouseApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IImportWarehouse | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IImportWarehouse[]>> {
    return axiosPrivate.get(importWarehouseEndpoints.common, {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: any): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.post(importWarehouseEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.delete(
        importWarehouseEndpoints.common + "/" + id
      );
    } catch (error) {
      throw error;
    }
  },
  async lock(data: {
    hoa_don_id: number;
    lock_or_open: string;
  }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.patch(importWarehouseEndpoints.lock, data);
    } catch (error) {
      throw error;
    }
  },
  async return(data: {
    hoa_don_id: number;
    ds_san_pham_tra: {
      cthd_nhap_kho_id: number;
      sku: string;
      so_luong_tra: number;
    }[];
  }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.patch(importWarehouseEndpoints.return, data);
    } catch (error) {
      throw error;
    }
  },
  async edit(data: {
    id: string | number;
    ten: string;
  }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.put(importWarehouseEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
};

export default importWarehouseApi;
