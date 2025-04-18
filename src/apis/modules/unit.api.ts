import axiosPrivate from "@/apis/client/private.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IUnit } from "@/models/interfaces";

const unitEndpoints = {
  common: "don-vi-tinh",
};

const unitApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IUnit | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IUnit[]>> {
    return axiosPrivate.get(unitEndpoints.common, {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: { ten: string }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.post(unitEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.delete(unitEndpoints.common + "/" + id);
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
      return await axiosPrivate.put(unitEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
};

export default unitApi;
