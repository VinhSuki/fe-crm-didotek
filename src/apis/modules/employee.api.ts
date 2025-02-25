// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars

import {
  IEmployee,
  IEmployeeAddResponse,
  IEmployeeDetailResponse,
  IEmployeeListResponse,
  IEmployeeUpdateStatusResponse
} from '@/models/interfaces/employee'
import { IApiResponse } from '@/models/interfaces/api'
import { EFieldByValue, ESortOrderValue } from '@/models/enums/option'
import axiosPrivate from '../client/private.client'

const employeeApi = {
  async list(params: {
    page: number
    limit: number
    query: string
    field: EFieldByValue
    status: any
    sort: EFieldByValue
    order: ESortOrderValue
  }): Promise<IApiResponse<IEmployeeListResponse>> {
    try {
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null))
      return await axiosPrivate.get('Account', { params: filteredParams })
    } catch (error) {
      throw error
    }
  },

  async detail({ id }: { id: number }): Promise<IApiResponse<IEmployeeDetailResponse>> {
    try {
      return await axiosPrivate.get(`Account/${id}`)
    } catch (error) {
      throw error
    }
  },

  async delete({ id }: { id: number }): Promise<IApiResponse> {
    try {
      return await axiosPrivate.delete(`Account/${id}`)
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
  }): Promise<IApiResponse<IEmployeeUpdateStatusResponse>> {
    try {
      return await axiosPrivate.patch(`Account/${id}`, { status })
    } catch (error) {
      throw error
    }
  },

  async add(data: {
    fullName: string
    phoneNumber: string
    email: string
    password: string
    rePassword: string
    sex: string
    roleId: number
    status: number
  }): Promise<IApiResponse<IEmployeeAddResponse>> {
    try {
      return await axiosPrivate.post('Account', data)
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
      fullName: string
      phoneNumber: string
      email: string
      password: string | null
      rePassword: string | null
      sex: string
      roleId: number
      status: number
    }
  }): Promise<IApiResponse<IEmployee>> {
    try {
      return await axiosPrivate.put(`Account/${id}`, data)
    } catch (error) {
      throw error
    }
  }
}

export default employeeApi
