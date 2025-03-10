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
  ID: number | string;
  ten: string;
  upc: string;
  loai_san_pham_id: number | string;
  loai_san_pham: string;
  hinh_anh: string;
  don_vi_tinh_id: number | string;
  don_vi_tinh: string;
  vat: number | string;
  mo_ta: string;
  trang_thai: string | number;
  loai_giam_gia_id: number | string;
  loai_giam_gia: string;
  thoi_gian_bao_hanh_id: number | string;
  thoi_gian_bao_hanh: string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}
export interface IProductDetail {
  ID: number | string;
  hinh_anh: string;
  san_pham_ID: string | number;
  ten_phan_loai: string;
  gia_nhap: number | string;
  gia_ban: number | string;
  so_luong: number | string;
  trang_thai: string | number;
  khong_phan_loai: number | string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface IProductType {
  ID: number | string;
  ten: string;
  hinh_anh: string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface IUnit {
  ID: number | string;
  ten: string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface IDiscountType {
  ID: number | string;
  ten: string;
  gia_tri: string | number;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface IWarrantyTime {
  ID: number | string;
  ten: string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface IClassify {
  ID?: string | number;
  hinh_anh: string;
  ten_phan_loai: string;
  trang_thai: string | number;
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
  minW?: string;
}

export interface IAccountLogin {
  message: string;
  token: string;
}

export interface IEmployee {
  ID: string | number;
  ten_dang_nhap: string;
  ho_ten: string;
  email: string;
  dien_thoai: string;
  dia_chi: string;
  avatar: string;
  chuc_vu_id: string | number;
  chuc_vu: string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface IRole {
  ID: string | number;
  ten: string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface IWarehouse {
  ID: number | string;
  ten: string;
  dia_chi: string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface ICustomer {
  ID: string | number;
  ho_ten: string;
  dien_thoai: string;
  dia_chi: string;
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}
