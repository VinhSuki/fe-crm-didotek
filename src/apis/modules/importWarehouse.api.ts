/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosPrivate from "@/apis/client/private.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IImportWarehouse } from "@/models/interfaces";

const importWarehouseEndpoints = {
  common: "hoa-don-nhap-kho",
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
      return await axiosPrivate.delete(importWarehouseEndpoints.common + "/" + id);
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
