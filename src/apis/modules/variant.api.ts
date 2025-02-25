import { EFieldByValue, ESortOrderValue } from '@/models/enums/option'
import { IApiResponse } from '@/models/interfaces/api'
import { IVariantDetailResponse, IVariantListResponse } from '@/models/interfaces/variant'
import axiosPrivate from '../client/private.client'

const variantApi = {
  async list(params: {
    page: number
    limit: number
    field: EFieldByValue
    status: any
    productId: number
    sort: EFieldByValue
    order: ESortOrderValue
  }): Promise<IApiResponse<IVariantListResponse>> {
    try {
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null))
      return await axiosPrivate.get('Variant', { params: filteredParams })
    } catch (error) {
      throw error
    }
  },
  async detail({ id }: { id: number }): Promise<IApiResponse<IVariantDetailResponse>> {
    try {
      return await axiosPrivate.get(`Variant/${id}`)
    } catch (error) {
      throw error
    }
  },

  async delete({ id }: { id: number }): Promise<IApiResponse> {
    try {
      return await axiosPrivate.delete(`Variant/${id}`)
    } catch (error) {
      throw error
    }
  },

  async updateStatus({
    id,
    status
  }: {
    id: number
    status: number
  }): Promise<IApiResponse> {
    try {
      return await axiosPrivate.patch(`Variant/${id}`, { 
        modifyField: 'Status',
        modifyValue: status.toString()
       })
    } catch (error) {
      throw error
    }
  },
  async add(data: FormData): Promise<IApiResponse<IVariantDetailResponse>> {
    try {
      return await axiosPrivate.post(`Variant`, data, {
        headers: {
          'Content-Type': 'multipart/form-data' // Đảm bảo header phù hợp với FormData
        }
      })
    } catch (error) {
      throw error
    }
  },
  async edit(id:number,data: FormData): Promise<IApiResponse<IVariantDetailResponse>> {
    try {
      return await axiosPrivate.put(`Variant/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data' // Đảm bảo header phù hợp với FormData
        }
      })
    } catch (error) {
      throw error
    }
  }
}

export default variantApi
