/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosPrivate from "@/apis/client/private.client";
import {
  IApiResponse,
  ISku
} from "@/models/interfaces";

const productEndpoints = {
  common: "ton-kho",
};

const productApi = {
  async detail(ctsp_id:string|number): Promise<IApiResponse<ISku[]>> {
    return axiosPrivate.get(productEndpoints.common, {
      params: { ctsp_id },
    });
  }
};

export default productApi;
