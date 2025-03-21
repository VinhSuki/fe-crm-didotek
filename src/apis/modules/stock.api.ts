/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosPrivate from "@/apis/client/private.client";
import {
  IApiResponse,
  IStock
} from "@/models/interfaces";

const stockEndpoints = {
  common: "ton-kho",
};

const stockApi = {
  async detail(ctsp_id:string|number): Promise<IApiResponse<IStock[]>> {
    return axiosPrivate.get(stockEndpoints.common + "/" + ctsp_id);
  }
};

export default stockApi;
