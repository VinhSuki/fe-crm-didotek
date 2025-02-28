// import { IProductDetailResponse } from "@/models/interfaces/product";
import axiosPublic from "@/apis/client/public.client";
import { ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IProductType } from "@/models/interfaces";

const productTypeApi = {
  async list(params: {
    page?: number;
    limit?: number;
    filters?: FilterSearch[];
    sort?: keyof IProductType | "";
    order?: ESortOrderValue;
  }): Promise<IApiResponse<IProductType[]>> {
    // console.log(`loai-san-pham/${params}`);
    console.log(params);
    // const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null))
    return axiosPublic.get("api/loai-san-pham", { params });
  },
  async add(data: FormData): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.post(`api/loai-san-pham`, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo header phù hợp với FormData
        },
      });
    } catch (error) {
      throw error;
    }
  },
  async delete(id:number | string): Promise<IApiResponse> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.delete(`api/loai-san-pham?id=${id}`);
    } catch (error) {
      throw error;
    }
  },
  async edit(data: FormData): Promise<IApiResponse<IProductType>> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.put(`api/loai-san-pham`, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo header phù hợp với FormData
        },
      });
    } catch (error) {
      throw error;
    }
  },
};

export default productTypeApi;
