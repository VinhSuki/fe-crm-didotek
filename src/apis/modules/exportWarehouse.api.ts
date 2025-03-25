/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosPrivate from "@/apis/client/private.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IExportWarehouse } from "@/models/interfaces";

const exportWarehouseEndpoints = {
  common: "hoa-don-xuat-kho",
  lock: "hoa-don-xuat-kho/lock",
  return: "hoa-don-xuat-kho/tra-hang",

};

const exportWarehouseApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IExportWarehouse | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IExportWarehouse[]>> {
    return axiosPrivate.get(exportWarehouseEndpoints.common, {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: any): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.post(exportWarehouseEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.delete(
        exportWarehouseEndpoints.common + "/" + id
      );
    } catch (error) {
      throw error;
    }
  },
  async edit(data: any): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.put(exportWarehouseEndpoints.common, data);
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
      return await axiosPrivate.patch(exportWarehouseEndpoints.lock, data);
    } catch (error) {
      throw error;
    }
  },
  async return(data: {
    hoa_don_id: number;
    ds_san_pham_tra: {
      cthd_xuat_kho_id: number;
      sku: string;
      so_luong_tra: number;
    }[];
  }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.patch(exportWarehouseEndpoints.return, data);
    } catch (error) {
      throw error;
    }
  },
};

export default exportWarehouseApi;
