import { IPagination } from './pagination'

export interface IRate {
  id: number
  pImage: string
  pName: string
  name: string
  rName: string | null
  star: number
  content: string
  reply: string | null
  status: number
  createdAt: string
  updatedAt: string
}

export interface IRateListResponse {
  rates: IRate[]
  pagination: IPagination
}

export interface IRateDetailResponse {
  status: number
  data: IRate[]
  message: string
}

export interface IRateDeleteResponse {
  status: number
  message: string
}

export interface IRateDeleteResponse {
  status: number
  message: string
}

export interface IRateUpdateStatusResponse {
  status: number
  data: {
    id: number
    status: number
    updatedAt: string
  }
  message: string
}

export interface IRateReplyResponse {
  status: number
  message: string
}

export interface IRateEditReplyResponse {
  status: number
  message: string
}
