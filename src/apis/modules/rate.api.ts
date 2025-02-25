// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { IRateDetailResponse, IRateListResponse, IRateUpdateStatusResponse } from '@/models/interfaces/rate'
import { IApiResponse } from '@/models/interfaces/api'
import { EFieldByValue, ESortOrderValue } from '@/models/enums/option'
import axiosPrivate from '../client/private.client'

const rateApi = {
  async list(params: {
    page: number
    limit: number
    query: string
    field: EFieldByValue
    status: any
    sort: EFieldByValue
    order: ESortOrderValue
  }): Promise<IApiResponse<IRateListResponse>> {
    try {
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null))
      return await axiosPrivate.get(`Rate`, { params: filteredParams })
    } catch (error) {
      throw error
    }
  },

  async detail({ id }: { id: number }): Promise<IApiResponse<IRateDetailResponse>> {
    try {
      return await axiosPrivate.get(`Rate/${id}`)
    } catch (error) {
      throw error
    }
  },

  async delete({ id }: { id: number }): Promise<IApiResponse> {
    try {
      return await axiosPrivate.delete(`Rate/${id}`)
    } catch (error) {
      throw error
    }
  },

  async updateStatus({ id, status }: { id: number; status: number }): Promise<IApiResponse<IRateUpdateStatusResponse>> {
    try {
      return await axiosPrivate.patch(`Rate/${id}`, { status })
    } catch (error) {
      throw error
    }
  },

  async reply({ id, reply }: { id: number; reply: string }): Promise<IApiResponse> {
    try {
      return await axiosPrivate.post(`Rate`, { id, reply })
    } catch (error) {
      throw error
    }
  }
}

export default rateApi
