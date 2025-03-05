import axiosPublic from "@/apis/client/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import {
  FilterSearch,
  IApiResponse,
  IWarrantyTime
} from "@/models/interfaces";

const warrantyTimeApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IWarrantyTime | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IWarrantyTime[]>> {
    return axiosPublic.get("api/thoi-gian-bao-hanh", {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: { ten: string }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.post(`api/thoi-gian-bao-hanh`, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.delete(`api/thoi-gian-bao-hanh/${id}`);
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
      return await axiosPublic.put(`api/thoi-gian-bao-hanh`, data);
    } catch (error) {
      throw error;
    }
  },
};

export default warrantyTimeApi;
