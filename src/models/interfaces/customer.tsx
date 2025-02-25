import { IPagination } from './pagination'

export interface ICustomer {
  id: number
  fullName: string
  phoneNumber: string
  email: string
  sex: number
  birthday: string
  password?: string
  totalSpending: number
  status: number
  createdAt: string
  updatedAt: string
}

export interface ICustomerListResponse {
  accounts: ICustomer[]
  pagination: IPagination
}

export interface ICustomerDetailResponse {
  data: ICustomer
}

export interface ICustomerDeleteResponse {
  status: number
  message: string
}

export interface ICustomerUpdateStatusResponse {
  id: number
  status: number
  updatedAt: string
}
