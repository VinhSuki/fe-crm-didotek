// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { IApiResponse } from '@/models/interfaces/api'
import { ICategory } from '@/models/interfaces/category'
import axiosPrivate from '../client/private.client'
import { EFieldByValue, ESortOrderValue } from '@/models/enums/option'
import { IPagination } from '@/models/interfaces/pagination'

const categoryEndpoints = {
  list: 'Category',
  detail: (id: string | number) => `category/${id}`
}

const categoryApi = {
  list(params: {
    page?: number
    limit?: number
    query?: string
    field?: EFieldByValue
    status?: any
    sort?: EFieldByValue
    order?: ESortOrderValue
  }): Promise<IApiResponse<{ categories: ICategory[] , pagination: IPagination }>> {
    const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null))
    return axiosPrivate.get('Category', { params: filteredParams })
  },
  detail(id: number): Promise<IApiResponse<{ categorie: ICategory }>> {
    return axiosPrivate.get(`Category/${id}`)
  },
  delete(id: number): Promise<IApiResponse<{ category: ICategory }>> {
    return axiosPrivate.delete(`Category/${id}`)
  },
  updateStatus(id: number, status: number): Promise<IApiResponse<{ category: ICategory }>> {
    return axiosPrivate.patch(`Category/${id}`, { status })
  },
  add(data:{name:string,referenceCategoryId:number,status:number}): Promise<IApiResponse<{ category: ICategory }>>{
    return axiosPrivate.post(`Category`, { ...data })
  },
  edit(id:number,data:{name:string,referenceCategoryId:number,status:number}): Promise<IApiResponse<{ category: ICategory }>>{
    return axiosPrivate.put(`Category/${id}`, { ...data })
  },
}

export default categoryApi
