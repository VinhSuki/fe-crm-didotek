import { EFieldByValue, ESortOrderValue } from '@/models/enums/option'
import { IApiResponse } from '@/models/interfaces/api'
import { IProductDetailResponse, IProductListResponse } from '@/models/interfaces/product'
import axiosPrivate from '../client/private.client'

const productApi = {
  async list(params: {
    page: number
    limit: number
    query: string
    field: EFieldByValue
    status: any
    sort: EFieldByValue
    order: ESortOrderValue
  }): Promise<IApiResponse<IProductListResponse>> {
    try {
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null))
      return await axiosPrivate.get('Product', { params: filteredParams })
    } catch (error) {
      throw error
    }
  },
  async detail({ id }: { id: number }): Promise<IApiResponse<IProductDetailResponse>> {
    try {
      return await axiosPrivate.get(`Product/${id}`)
    } catch (error) {
      throw error
    }
  },

  async delete({ id }: { id: number }): Promise<IApiResponse> {
    try {
      return await axiosPrivate.delete(`Product/${id}`)
    } catch (error) {
      throw error
    }
  },

  async updateStatus({ id, status }: { id: number; status: number }): Promise<IApiResponse> {
    try {
      return await axiosPrivate.patch(`Product/${id}`, {
        modifyField: 'Status',
        modifyValue: status.toString()
      })
    } catch (error) {
      throw error
    }
  },
  async add(data: FormData): Promise<IApiResponse<IProductDetailResponse>> {
    try {
      return await axiosPrivate.post(`Product`, data, {
        headers: {
          'Content-Type': 'multipart/form-data' // Đảm bảo header phù hợp với FormData
        }
      })
    } catch (error) {
      throw error
    }
  },
  async edit(id:number,data: FormData): Promise<IApiResponse<IProductDetailResponse>> {
    try {
      return await axiosPrivate.put(`Product/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data' // Đảm bảo header phù hợp với FormData
        }
      })
    } catch (error) {
      throw error
    }
  }
}

export default productApi
