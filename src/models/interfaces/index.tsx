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
  data?: {
    data: T;
    total_page: number;
  };
}

export interface IProduct {
  ID: number;
  ten: string;
  upc: string;
  loai_san_pham_ID: number;
  loai_san_pham:string;
  hinh_anh: string;
  don_vi_tinh_id: number; 
  don_vi_tinh:string;
  vat: number;
  mo_ta: string;
  trang_thai: string;
  loai_giam_gia_ID: number;
  loai_giam_gia: string;
  thoi_gian_bao_hanh_ID: number;
  thoi_gian_bao_hanh:string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}
export interface IProductDetail {
  ID: number;
  hinh_anh: string;
  san_pham_ID: string;
  ten_phan_loai: string;
  gia_nhap: number;
  gia_ban: number;
  so_luong: number;
  trang_thai: string;
  khong_phan_loai: number;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface IProductType {
  ID: number;
  ten: string;
  hinh_anh: string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface IUnit {
  ID: number;
  ten: string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface IDiscountType {
  ID: number;
  ten: string;
  gia_tri: number;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface IWarrantyTime {
  ID: number;
  ten: string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface FilterOption {
  ID: string;
  label: string;
  icon: JSX.Element;
}

export interface FilterSearch {
  field: string;
  condition: string;
  value: string | undefined;
}

export interface ISortOrder<T = undefined> {
  sort: keyof T | "";
  order: ESortOrderValue;
}

export interface Column<T> {
  key: keyof T;
  label: string;
  sortName?: keyof T;
  searchCondition?: "number" | "text" | undefined;
  render?: (row: T) => React.ReactNode;
  minW?:string
}
