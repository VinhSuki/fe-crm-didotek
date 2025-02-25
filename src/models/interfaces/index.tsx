export interface IProduct {
  id: number;
  image: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  vat: string;
  status: string;
  discountType: string;
  warranty: number | null;
  createdAt: string;
}

export interface IProductType {
  id: number;
  ten: string;
  anh: string;
  created_at: string;
}
