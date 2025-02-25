import { IPagination } from './pagination'

export interface IDiscount {
  id: number
  name: string
  discountValue: number
  expireDate: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface IDiscountListResponse {
  discounts: IDiscount[]
  pagination: IPagination
}

export interface IDiscountAddResponse {
  status: number
  data: IDiscount
  message: string
}

export interface IDiscountDetailResponse {
  status: number
  data: IDiscount
  message: string
}

export interface IDiscountDeleteResponse {
  status: number
  message: string
}

export interface IDiscountUpdateStatusResponse {
  id: number
  status: number
  updatedAt: string
}

export interface IDiscountUpdateResponse {
  status: number
  data: {
    name: string
    discount: number
    expireDate: string
    status: number
    updatedAt: string
  }
  message: string
}
