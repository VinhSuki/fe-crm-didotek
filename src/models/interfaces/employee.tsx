import { IPagination } from './pagination'

export interface IEmployee {
  id: number
  fullName: string
  phoneNumber: string
  password?: string
  email: string
  sex: string
  role: {
    id: number
    name: string
    rolePermissions: null
  }
  status: number
  createdAt?: string
  updatedAt?: string
}

export interface IEmployeeListResponse {
  accounts: IEmployee[]
  pagination: IPagination
}

export interface IEmployeeDetailResponse {
  account: IEmployee
}

export interface IEmployeeDeleteResponse {
  status: number
  message: string
}

export interface IEmployeeUpdateStatusResponse {
  id: number
  status: number
  updatedAt: string
}

export interface IEmployeeAddResponse {
  name: string
  phoneNumber: string
  email: string
  sex: string
  role: number
  password: string
  status: string
}
