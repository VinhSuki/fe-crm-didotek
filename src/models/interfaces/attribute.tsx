import { IPagination } from './pagination'

export interface IAttributeType {
  id: number | string
  name: string
  createdAt?: string
  updatedAt?: string
  attributeValues?: IAttributeValue | null
  productAttributeTypes?: null
}

export interface IAttributeValue {
  id: number | string
  attributeTypeId?: number,
  attributeType?: IAttributeType,
  attributeTypeName: string
  name: string
  value: string
  status: number
  createdAt: string
  updatedAt: string
  variantAttributeValues: null
}

export interface IAttributeValueListResponse {
  attributeValues: IAttributeValue[]
  pagination: IPagination
}

export interface IAttributeValueDetailResponse {
  attributeValue: IAttributeValue
}

export interface IAttributeValueDeleteResponse {
  status: number
  message: string
}