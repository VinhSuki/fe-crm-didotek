import axiosPublic from "@/apis/client/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IRole } from "@/models/interfaces";

const rolePermissionEndpoints = {
  common: "chuc-vu",
};

const rolePermissionApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IRole | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IRole[]>> {
    return axiosPublic.get(rolePermissionEndpoints.common, {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: { ten: string }): Promise<IApiResponse> {
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
  async edit(data: {
    id: string | number;
    ten: string;
  }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.put(rolePermissionEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
};

export default rolePermissionApi;
