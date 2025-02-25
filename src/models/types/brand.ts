import { ReactNode } from 'react';

export type TBrand = {
  logo: string;
  name: string;
  visitors: number;
  revenues: string;
  sales: number;
  conversion: number;
};

export type TMenuItem = {
  url: string
  title: string
  icon: ReactNode
  onlyIcon?: boolean
}
