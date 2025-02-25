import { IAttributeType } from './attribute';
import { ICategory } from './category';
import { IDiscount } from './discount';
import { IPagination } from './pagination';

export interface ITag {
  id: number;
  name: string;
}

export interface IProduct {
  id: number;
  name: string;
  category: ICategory;
  description: string;
  discount: IDiscount;
  basePrice: number;
  slug: string;
  thumbnail: string;
  view: number;
  like: number;
  status: number;
  updatedAt: string;
  createdAt: string;
  attributeTypes: IAttributeType[];
  tags: ITag[];
}

export interface IProductListResponse {
  products: IProduct[]
  pagination: IPagination
}

export interface IProductDetailResponse {
  product: IProduct
}

export interface IProductDeleteResponse {
  status: number
  message: string
}