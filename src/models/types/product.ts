export type TProduct = {
  image: string;
  name: string;
  category: string;
  price: number;
  sold: number;
  profit: number;
};

export type TProductFormData = {
  status: string | number;
  name: string;
  basePrice: string | number;
  categoryId: string | number;
  discountId: string | number;
  productFile: File;
  attributeType: string[];
  description: string;
}
