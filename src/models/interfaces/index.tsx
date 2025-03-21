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
    total_page?: number;
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
  searchCondition?: "number" | "text" | "money" | undefined;
  render?: (row: T) => React.ReactNode;
  minW?: string;
}

export interface IAccountLogin {
  ds_quyen: string[];
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
  quyen?:string[]
}

export interface IDistributor {
  ID: string | number;
  ten: string;
  email: string;
  dien_thoai: string;
  dia_chi: string;
  ds_san_pham: IProduct[];
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

export interface IImportProduct {
  chiet_khau: string | number;
  ctsp_id: number | string;
  don_vi_tinh: string;
  gia_ban: string | number;
  gia_nhap: string | number;
  ke: string;
  la_qua_tang: boolean;
  san_pham_id: number | string;
  so_luong: string | number;
  upc: string;
  han_su_dung: Date | string;
  ctsp_ten?: string;
  thanh_tien: string | number;
  sku?: string;
}

export interface IExportProduct {
  chiet_khau: string | number;
  upc: string;
  ctsp_ten: string;
  ctsp_id: number | string;
  don_vi_tinh: string;
  gia_ban: string | number;
  la_qua_tang: boolean;
  san_pham_id: number | string;
  so_luong_ban: string | number;
  thanh_tien: string | number;
  thanh_tien_truoc_chiet_khau: string | number;
  sku?:string;
  sku_xuat?:string;
  ds_sku: {
    sku: string;
    so_luong_ban: string | number;
    gia_ban_truoc: string | number;
  }[];
}

export interface ISku {
  sku: string;
  han_su_dung: Date | string;
  don_vi_tinh: string;
  so_luong_ton: string | number;
  so_luong_ban: string | number;
  gia_ban_truoc: string | number;
}

export interface IStock{
  sku: string;
  han_su_dung: Date | string;
  don_vi_tinh: string;
  so_luong_ton: string | number;
  so_luong_ban: string | number;
  gia_ban: string | number;
}

export interface IImportWarehouse {
  ID: number | string;
  con_lai: string | number;
  ghi_chu: string;
  kho: string;
  kho_id: string | number;
  ma_hoa_don: string;
  ngay_nhap: Date | string;
  nha_phan_phoi: string;
  nha_phan_phoi_id: string | number;
  so_hoa_don: string;
  tong_tien: string | number;
  tra_truoc: string | number;
  ds_san_pham_nhap: IImportProduct[];
  UpdatedAt: string;
  DeletedAt: string;
  CreatedAt: string;
  created_at: string;
}

export interface IExportWarehouse {
  ID: number | string;
  ma_hoa_don: string;
  con_lai: string | number;
  khach_hang_id: string | number;
  khach_hang: string;
  nhan_vien_giao_hang_id: string | number;
  nhan_vien_giao_hang: string | number;
  nhan_vien_sale: string;
  nhan_vien_sale_id: string | number;
  ghi_chu: string;
  ngay_xuat: Date | string;
  so_hoa_don: string;
  tong_tien: string | number;
  tra_truoc: string | number;
  ds_san_pham_xuat: IExportProduct[];
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

export interface IOption {
  ID: string | number;
  ten: string;
}

export interface IGroupProduct {
  group: string;
  groupId: string | number;
  items: {
    ID: string | number;
    ten: string;
    upc: string;
    don_vi_tinh: string;
  }[];
}
export interface IPermission{
  ID:string | number;
  ten:string;
  code:string;
  trang_thai:boolean
}

export interface IActive{
  ID:string | number;
  active:boolean
}
export interface IRolePermission{
  hien_thi_menu:string;
  loai_quyen:string;
  quyen:IPermission[]
}