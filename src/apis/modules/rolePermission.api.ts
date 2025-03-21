import axiosPrivate from "@/apis/client/private.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IActive, IApiResponse, IRole, IRolePermission } from "@/models/interfaces";

const rolePermissionEndpoints = {
  common: "chuc-vu",
  permission: "quyen",
};

const rolePermissionApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IRole | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IRole[]>> {
    return axiosPrivate.get(rolePermissionEndpoints.common, {
      params: { ...params, filters: JSON.stringify(params.filters) },
    });
  },
  async add(data: { ten: string }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.post(rolePermissionEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async delete(id: number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.delete(
        rolePermissionEndpoints.common + "/" + id
      );
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
      return await axiosPrivate.put(rolePermissionEndpoints.common, data);
    } catch (error) {
      throw error;
    }
  },
  async listPermission(chuc_vu_id: string | number): Promise<IApiResponse<IRolePermission[]>> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.get(rolePermissionEndpoints.permission + "/" + chuc_vu_id);
    } catch (error) {
      throw error;
    }
  },
  async modifyPermission(data: {
    chuc_vu_id: number;
    quyen: IActive[];
  }): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPrivate.patch(rolePermissionEndpoints.permission + '/modify' , data);
    } catch (error) {
      throw error;
    }
  },
};

export default rolePermissionApi;
