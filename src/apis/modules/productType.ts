
// import { IProductDetailResponse } from "@/models/interfaces/product";
import axiosPublic from "@/apis/client/public.client";
import { EFieldByValue, ESortOrderValue } from "@/models/enums/option";
import { FilterSearch, IApiResponse, IProductType } from "@/models/interfaces";

const productTypeApi = {
  async list(data: {
    page?: number
    limit?: number
    filters?:FilterSearch[]
    sort?: EFieldByValue
    order?: ESortOrderValue
  }): Promise<IApiResponse<IProductType[]>> {
    return axiosPublic.post('v1/loai-san-pham', data)
  },
  async add(data: FormData): Promise<IApiResponse<IProductType>> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await axiosPublic.post(`v1/loai-san-pham`, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo header phù hợp với FormData
        },
      });
    } catch (error) {
      throw error;
    }
  },
  async addFake(data: FormData) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Xóa dữ liệu thành công");
        resolve(); // Đánh dấu hoàn tất
      }, 1000);
    });
  },
};

export default productTypeApi;
