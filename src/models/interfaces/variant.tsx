import { IAttributeValue } from './attribute'
import { IPagination } from './pagination'

export interface IVariant {
  id: number
  productName: string
  price: number
  stock: number
  thumbnail: string
  status: number
  createdAt: string
  updatedAt: string
  attributeValues: IAttributeValue[]
}

export interface IVariantListResponse {
  variants: IVariant[]
  pagination: IPagination
}

export interface IVariantDetailResponse {
  variant: IVariant
}

export interface IVariantDeleteResponse {
  status: number
  message: string
}
