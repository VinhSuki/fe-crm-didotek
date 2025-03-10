import axiosPublic from "@/apis/client/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IWarehouse } from "@/models/interfaces";

const warehouseEndpoints = {
  common: "kho",
};

const warehouseApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IWarehouse | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IWarehouse[]>> {
    return axiosPublic.get(warehouseEndpoints.common, {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: { ten: string }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.post(warehouseEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.delete(warehouseEndpoints.common + "/" + id);
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
      return await axiosPublic.put(warehouseEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
};

export default warehouseApi;
