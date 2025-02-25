// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars

import {
  ICustomerDetailResponse,
  ICustomerListResponse,
  ICustomerUpdateStatusResponse
} from '@/models/interfaces/customer'
import { EFieldByValue, ESortOrderValue } from '@/models/enums/option'
import { IApiResponse } from '@/models/interfaces/api'
import axiosPrivate from '../client/private.client'

const customerApi = {
  // Lấy danh sách khách hàng
  async list(params: {
    page: number
    limit: number
    query: string
    field: EFieldByValue
    status: any
    sort: EFieldByValue
    order: ESortOrderValue
  }): Promise<IApiResponse<ICustomerListResponse>> {
    try {
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null))
      return await axiosPrivate.get('Customer', { params: filteredParams })
    } catch (error) {
      throw error
    }
  },

  // Lấy thông tin chi tiết của khách hàng
  async detail({ id }: { id: number }): Promise<IApiResponse<ICustomerDetailResponse>> {
    try {
      return await axiosPrivate.get(`Customer/${id}`)
    } catch (error) {
      throw error
    }
  },

  // Xóa khách hàng
  async delete({ id }: { id: number }): Promise<IApiResponse> {
    try {
      return await axiosPrivate.delete(`Customer/${id}`)
    } catch (error) {
      throw error
    }
  },

  // Cập nhật trạng thái của khách hàng
  async updateStatus({
    id,
    status
  }: {
    id: number
    status: number
  }): Promise<IApiResponse<ICustomerUpdateStatusResponse>> {
    try {
      return await axiosPrivate.patch(`Customer/${id}`, {
        status
      })
    } catch (error) {
      throw error
    }
  }
}

export default customerApi
