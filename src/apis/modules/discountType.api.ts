// import { IProductDetailResponse } from "@/models/interfaces/product";
import axiosPublic from "@/apis/client/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import {
  FilterSearch,
  IApiResponse,
  IDiscountType
} from "@/models/interfaces";

const discountTypeApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IDiscountType | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IDiscountType[]>> {
    return axiosPublic.get("api/v1/loai-giam-gia", {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: { ten: string,gia_tri:string }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.post(`api/v1/loai-giam-gia`, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.delete(`api/v1/loai-giam-gia/${id}`);
    } catch (error) {
      throw error;
    }
  },
  async edit(data: {
    id: string | number;
    ten: string;
    gia_tri:string
  }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.put(`api/v1/loai-giam-gia`, data);
    } catch (error) {
      throw error;
    }
  },
};

export default discountTypeApi;
