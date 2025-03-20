/* eslint-disable @typescript-eslint/no-explicit-any */
// import { IProductDetailResponse } from "@/models/interfaces/product";
import axiosPrivate from "@/apis/client/private.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IDistributor } from "@/models/interfaces";

const distributorEndpoints = {
  common: "nha-phan-phoi",
};

const distributorApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IDistributor | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IDistributor[]>> {
    return axiosPrivate.get(distributorEndpoints.common, {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: any): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.post(distributorEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.delete(distributorEndpoints.common + "/" + id);
    } catch (error) {
      throw error;
    }
  },
  async edit(data: any): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.put(distributorEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
};

export default distributorApi;
