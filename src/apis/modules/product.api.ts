import axiosPublic from "@/apis/client/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import {
  FilterSearch,
  IApiResponse,
  IProduct
} from "@/models/interfaces";

const productApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IProduct | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IProduct[]>> {
    return axiosPublic.get("api/san-pham", {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: { ten: string }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.post(`api/san-pham`, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.delete(`api/san-pham/${id}`);
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
      return await axiosPublic.put(`api/san-pham`, data);
    } catch (error) {
      throw error;
    }
  },
};

export default productApi;
