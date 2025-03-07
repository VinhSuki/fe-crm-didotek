/* eslint-disable @typescript-eslint/no-explicit-any */
// import { IProductDetailResponse } from "@/models/interfaces/product";
import axiosPublic from "@/apis/client/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IProductType } from "@/models/interfaces";

const productTypeEndpoints = {
  common: "loai-san-pham",
};

const productTypeApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IProductType | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IProductType[]>> {
    return axiosPublic.get(productTypeEndpoints.common, {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: any): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.post(productTypeEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.delete(productTypeEndpoints.common + "/" + id);
    } catch (error) {
      throw error;
    }
  },
  async edit(data: any): Promise<IApiResponse<IProductType>> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.put(productTypeEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
};

export default productTypeApi;
