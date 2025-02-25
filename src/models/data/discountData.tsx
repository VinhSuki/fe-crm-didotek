import { IDiscount } from '../interfaces/discount'
import { IOptions } from '../interfaces/options'

export const discountOption: IOptions[] = [
  {
    value: 0,
    label: '---Select Discount---'
  },
  {
    value: 1,
    label: '20% Off Summer Sale%'
  },
  {
    value: 2,
    label: '10% Off First Order%'
  },
  {
    value: 4,
    label: 'Black Friday 30% Off'
  },
  {
    value: 5,
    label: '15% Off for Members'
  }
]

export const discountData: IDiscount[] = [
  {
    id: 1,
    name: '20% Off Summer Sale',
    discount: 20,
    expireDate: '2024-06-30T23:59:59Z',
    status: 1, // 1: Active
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z'
  },
  {
    id: 2,
    name: '10% Off First Order',
    discount: 10,
    expireDate: '2024-12-31T23:59:59Z',
    status: 1, // 1: Active
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z'
  },
  {
    id: 3,
    name: 'Buy 1 Get 1 Free',
    discount: 50,
    expireDate: '2024-03-31T23:59:59Z',
    status: 0, // 0: Inactive
    createdAt: '2023-12-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z'
  },
  {
    id: 4,
    name: 'Black Friday 30% Off',
    discount: 30,
    expireDate: '2024-11-30T23:59:59Z',
    status: 1, // 1: Active
    createdAt: '2024-10-01T12:00:00Z',
    updatedAt: '2024-10-15T12:00:00Z'
  },
  {
    id: 5,
    name: '15% Off for Members',
    discount: 15,
    expireDate: '2024-09-30T23:59:59Z',
    status: 1, // 1: Active
    createdAt: '2024-02-01T12:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z'
  }
]
