/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosPublic from "@/apis/client/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import {
  FilterSearch,
  IApiResponse,
  IClassify,
  IProduct,
} from "@/models/interfaces";

const productEndpoints = {
  common: "san-pham",
  classify: "chi-tiet-san-pham",
};

const productApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IProduct | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IProduct[]>> {
    return axiosPublic.get(productEndpoints.common, {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: any): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.post(productEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async edit(data: any): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.put(productEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.delete(productEndpoints.common + "/" + id);
    } catch (error) {
      throw error;
    }
  },
  async classify(id: string | number): Promise<IApiResponse<IClassify[]>> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.get(productEndpoints.classify + "/" + id);
    } catch (error) {
      throw error;
    }
  },
};

export default productApi;
