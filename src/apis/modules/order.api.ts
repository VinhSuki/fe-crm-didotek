import {
  IOrder,
  IOrderListResponse,
  IOrderUpdateStatusResponse
} from '@/models/interfaces/order'
import { IApiResponse } from '@/models/interfaces/api'
import { EFieldByValue, ESortOrderValue } from '@/models/enums/option'
import axiosPrivate from '../client/private.client'

const orderApi = {
  async list(params: {
    page: number
    limit: number
    query: string
    field: EFieldByValue
    status: any
    sort: EFieldByValue
    order: ESortOrderValue
  }): Promise<IApiResponse<IOrderListResponse>> {
    try {
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null))
      return await axiosPrivate.get(`Order`, { params: filteredParams })
    } catch (error) {
      throw error
    }
  },

  async detail({ id }: { id: number }): Promise<IApiResponse<IOrder>> {
    try {
      return await axiosPrivate.get(`Order/${id}`)
    } catch (error) {
      throw error
    }
  },

  async delete({ id }: { id: number }): Promise<IApiResponse> {
    try {
      return await axiosPrivate.delete(`Order/${id}`)
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
  }): Promise<IApiResponse<IOrderUpdateStatusResponse>> {
    try {
      return await axiosPrivate.patch(`Order/${id}`, { status })
    } catch (error) {
      throw error
    }
  },
}

export default orderApi
