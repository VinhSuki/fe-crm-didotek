export interface ICategory {
  id: number
  name: string
  referenceCategory?: ICategory
  referenceCategoryId?:number 
  status: number
  slug: string
  createdAt: string
  updatedAt: string
}
