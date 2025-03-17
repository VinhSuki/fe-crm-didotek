/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosPublic from "@/apis/client/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IExportWarehouse } from "@/models/interfaces";

const exportWarehouseEndpoints = {
  common: "hoa-don-xuat-kho",
};

const exportWarehouseApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IExportWarehouse | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IExportWarehouse[]>> {
    return axiosPublic.get(exportWarehouseEndpoints.common, {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: any): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.post(exportWarehouseEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.delete(
        exportWarehouseEndpoints.common + "/" + id
      );
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
      return await axiosPublic.put(exportWarehouseEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
};

export default exportWarehouseApi;
