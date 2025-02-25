// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars

import {
  IContactDetailResponse,
  IContactListResponse,
  IContactDeleteResponse,
  IContactUpdateStatusResponse,
  IContactAddResponse
} from '@/models/interfaces/contact'
import {  contactDetailResponseData } from '@/models/data/contactData'
import { EFieldByValue, ESortOrderValue } from '@/models/enums/option'
import { IApiResponse } from '@/models/interfaces/api'
import { EContactStatus } from '@/models/enums/status'
import axiosPrivate from '../client/private.client'

const contactEndpoints = {
  list: 'contact',
  detail: ({ id }: { id: number }) => `contact/${id}`,
  delete: ({ id }: { id: number }) => `contact/delete/${id}`,
  updateStatus: ({ id }: { id: number }) => `contact/update/status/${id}`,
  add: 'contact/add',
  update: ({ id }: { id: number }) => `contact/update/${id}`
}

const contactApi = {
  // Lấy danh sách contact với tham số
  async list(params: {
    page: number
    limit: number
    query: string
    field: EFieldByValue
    status: EContactStatus | null
    sort: EFieldByValue
    order: ESortOrderValue
  }): Promise<IContactListResponse> {
    try {
      const response = await axiosPrivate.get(contactEndpoints.list, { params });
      return response.data; // Chỉ trả về `data`
    } catch (error: any) {
      throw error.response?.data || error.message || error;
    }
  }, 
  

  // Lấy thông tin chi tiết của một contact
  detail({ id }: { id: number }): IContactDetailResponse {
    try {
      return contactDetailResponseData
    } catch (error) {
      throw error
    }
  },

  // Xóa một contact
  async delete({ id }: { id: number }): Promise<IContactDeleteResponse> {
    try {
      return await axiosPrivate.delete(`Contact/${id}`)
    } catch (error) {
      throw error
    }
  },

  // Sửa trạng thái của contact
  async updateStatus({
    id,
    status
  }: {
    id: number
    status: number
  }): Promise<IApiResponse<IContactUpdateStatusResponse>> {
    try {
      return await axiosPrivate.patch(`Contact/${id}`, {
        status
      })
    } catch (error) {
      throw error
    }
  },

  // Thêm một contact mới
  async add(data: {
    title: string
    message: string
    fullName: string
    email: string
    phoneNumber: string
    status: number
  }): Promise<IContactAddResponse> {
    try {
      const response = await axiosPrivate.post(contactEndpoints.add, data)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default contactApi
