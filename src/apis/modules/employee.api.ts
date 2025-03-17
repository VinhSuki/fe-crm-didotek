/* eslint-disable @typescript-eslint/no-explicit-any */
// import { IProductDetailResponse } from "@/models/interfaces/product";
import axiosPublic from "@/apis/client/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IEmployee } from "@/models/interfaces";

const rolePermissionEndpoints = {
  common: "nhan-vien",
};

const employeeApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IEmployee | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IEmployee[]>> {
    return axiosPublic.get(rolePermissionEndpoints.common, {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: any): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.post(rolePermissionEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.delete(rolePermissionEndpoints.common + "/" + id);
    } catch (error) {
      throw error;
    }
  },
  async edit(data: any): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.put(rolePermissionEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
};

export default employeeApi;
