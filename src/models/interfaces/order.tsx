import { IPagination } from './pagination'

export interface IOrder {
  id: number
  email: string
  name: string
  phoneNumber: string
  address: string
  note: string
  payMethod: string
  totalMoney: number
  shipDate: string
  receiveDate: string
  status: number
  createdAt?: string
  variants: {
    id: number
    name: string
    thumbnail: string
    attribute: [
      Color: any,
      Size: any
    ]
    quantity: number
    originalPrice: number
    finalPrice: number
    discountValue: number
  }[]
}

export interface IOrderListResponse {
  orders: IOrder[]
  pagination: IPagination
}

export interface IOrderDeleteResponse {
  status: number
  message: string
}

export interface IOrderDeleteResponse {
  status: number
  message: string
}

export interface IOrderUpdateStatusResponse {
  status: number
  data: {
    id: number
    status: number
    updatedAt: string
  }
  message: string
}
