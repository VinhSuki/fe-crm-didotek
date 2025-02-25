import { IPagination } from './pagination'

export interface ITag {
  id: number
  name: string
}

export interface ITagListResponse {
  status: number
  data: {
    tags: ITag[]
    pagination: IPagination
  }
  message: string
}

export interface ITagDetailResponse {
  status: number
  data: ITag
  message: string
}

export interface ITagDeleteResponse {
  status: number
  message: string
}

export interface ITagDeleteResponse {
  status: number
  message: string
}

export interface ITagUpdateStatusResponse {
  status: number
  data: {
    id: number
    status: number
    updatedAt: string
  }
  message: string
}

export interface ITagAddResponse {
  status: number
  data: {
    name: string
    phoneNumber: string
    email: string
    sex: string
    role: number
    password: string
    status: string
  }
  message: string
}

export interface ITagUpdateResponse {
  status: number
  data: {
    name: string
    phoneNumber: string
    email: string
    sex: string
    role: number
    password: string
    status: string
  }
  message: string
}
