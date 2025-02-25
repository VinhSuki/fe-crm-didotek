import { EFieldByValue, ESortOrderValue } from '@/models/enums/option'
import { IApiResponse } from '@/models/interfaces/api'
import {
  IDiscount,
  IDiscountListResponse,
  IDiscountUpdateResponse,
  IDiscountUpdateStatusResponse
} from '@/models/interfaces/discount'
import axiosPrivate from '../client/private.client'

const discountApi = {
  async list(params: {
    page?: number
    limit?: number
    query?: string
    field?: EFieldByValue
    status?: any
    sort?: EFieldByValue
    order?: ESortOrderValue
  }): Promise<IApiResponse<IDiscountListResponse>> {
    try {
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null))
      return await axiosPrivate.get('Discount', { params: filteredParams })
    } catch (error) {
      throw error
    }
  },

  async detail({ id }: { id: number }): Promise<IApiResponse<IDiscount>> {
    try {
      return await axiosPrivate.get(`Discount/${id}`)
    } catch (error) {
      throw error
    }
  },

  async delete({ id }: { id: number }): Promise<IApiResponse> {
    try {
      return await axiosPrivate.delete(`Discount/${id}`)
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
  }): Promise<IApiResponse<IDiscountUpdateStatusResponse>> {
    try {
      return await axiosPrivate.patch(`Discount/${id}`, { status })
    } catch (error) {
      throw error
    }
  },

  async add(data: {
    name: string
    discountValue: number
    expireDate: string
    status: number
  }): Promise<IApiResponse<IDiscount>> {
    try {
      return await axiosPrivate.post('Discount', data)
    } catch (error) {
      throw error
    }
  },

  async update({
    id,
    data
  }: {
    id: number
    data: {
      name: string
      discountValue: number
      expireDate: string
      status: number
    }
  }): Promise<IDiscountUpdateResponse> {
    try {
      return await axiosPrivate.put(`Discount/${id}`, data)
    } catch (error) {
      throw error
    }
  }
}

export default discountApi
