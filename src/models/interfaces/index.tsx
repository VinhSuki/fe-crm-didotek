import { ESortOrderValue } from "@/models/enums/option";
import { JSX } from "react";

export interface Pagination {
  currentPage: number;
  totalPage: number;
}
export interface IApiResponse<T = undefined> {
  success: boolean;
  error: number;
  message: string;
  data?:{
    data: T;
    total_page: number;
  }
}

export interface IProduct {
  ID: number;
  ten: string;
  upc: string;
  loai_san_pham_id: number;
  hinh_anh: string;
  don_vi_tinh_id: number;
  vat: number;
  mo_ta: string;
  trang_thai: string;
  loai_giam_gia_id: number;
  thoi_gian_bao_hanh_id: number;
  updated_at: string;
  deleted_at: string;
  created_at: string;
}
export interface IProductDetail {
  id: number;
  hinh_anh: string;
  san_pham_id: string;
  ten_phan_loai: string;
  gia_nhap: number;
  gia_ban: number;
  so_luong: number;
  trang_thai: string;
  khong_phan_loai: number;
  updated_at: string;
  deleted_at: string;
  created_at: string;
}

export interface IProductType {
  ID: number;
  ten: string;
  hinh_anh: string;
  updated_at: string;
  deleted_at: string;
  created_at: string;
}

export interface ICalculateUnit {
  id: number;
  ten: string;
  updated_at: string;
  deleted_at: string;
  created_at: string;
}

export interface ISaleType {
  id: number;
  ten: string;
  gia_tri: number;
  updated_at: string;
  deleted_at: string;
  created_at: string;
}

export interface IWarrantyTime {
  id: number;
  ten: string;
  updated_at: string;
  deleted_at: string;
  created_at: string;
}

export interface FilterOption {
  id: string;
  label: string;
  icon: JSX.Element;
}

export interface FilterSearch {
  field: string;
  condition: string;
  value: string;
}


export interface ISortOrder<T = undefined> {
  sort: keyof T | "";
  order: ESortOrderValue;
}