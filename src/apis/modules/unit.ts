// import { IProductDetailResponse } from "@/models/interfaces/product";
import axiosPublic from "@/apis/client/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import {
  FilterSearch,
  IApiResponse,
  IProductType,
  IUnit,
} from "@/models/interfaces";

const unitApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IProductType | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IUnit[]>> {
    return axiosPublic.get("api/don-vi-tinh", {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: { ten: string }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.post(`api/don-vi-tinh`, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.delete(`api/don-vi-tinh/${id}`);
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
      return await axiosPublic.put(`api/don-vi-tinh`, data);
    } catch (error) {
      throw error;
    }
  },
};

export default unitApi;
