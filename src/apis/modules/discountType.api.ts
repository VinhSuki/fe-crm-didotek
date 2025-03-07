/* eslint-disable no-useless-catch */
// import { IProductDetailResponse } from "@/models/interfaces/product";
import axiosPublic from "@/apis/client/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IDiscountType } from "@/models/interfaces";

const discountTypeEndpoints = {
  common: "loai-giam-gia",
};

const discountTypeApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IDiscountType | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IDiscountType[]>> {
    return axiosPublic.get(discountTypeEndpoints.common, {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: { ten: string; gia_tri: number }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.post(discountTypeEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.delete(discountTypeEndpoints.common + "/" + id);
    } catch (error) {
      throw error;
    }
  },
  async edit(data: {
    id: string | number;
    ten: string;
    gia_tri: string | number;
  }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    const convertData = {
      ...data,
      gia_tri: Number(data.gia_tri),
      id: Number(data.id),
    };
    try {
      return await axiosPublic.put(discountTypeEndpoints.common, {
        ...convertData,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default discountTypeApi;
