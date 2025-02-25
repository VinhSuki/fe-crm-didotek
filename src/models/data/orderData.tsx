import { IOrderDetailResponse, IOrderListResponse } from '../interfaces/order' // Giả sử bạn đã có interface này

export const orderListResponseData: IOrderListResponse = {
  status: 200,
  data: {
    orders: [
      {
        id: 1,
        email: 'johndoe@example.com',
        name: 'John Doe',
        phoneNumber: '123-456-7890',
        address: '123 Main St, Cityville',
        note: 'Urgent delivery',
        payMethod: 'Credit Card',
        totalMoney: 100.5,
        shipDate: '2024-12-01',
        receiveDate: '2024-12-05',
        status: 1,
        createdAt: '1734974964.4281',
        updatedAt: '1734974964.4281'
      },
      {
        id: 2,
        email: 'janesmith@example.com',
        name: 'Jane Smith',
        phoneNumber: '234-567-8901',
        address: '456 Elm St, Townsville',
        note: 'Gift for friend',
        payMethod: 'Paypal',
        totalMoney: 150.75,
        shipDate: '2024-12-02',
        receiveDate: '2024-12-06',
        status: 1,
        createdAt: '1734974964.4281',
        updatedAt: '1734974964.4281'
      },
      {
        id: 3,
        email: 'alicebrown@example.com',
        name: 'Alice Brown',
        phoneNumber: '345-678-9012',
        address: '789 Oak St, Villagetown',
        note: 'Special request for packaging',
        payMethod: 'Bank Transfer',
        totalMoney: 120.3,
        shipDate: '2024-12-03',
        receiveDate: '2024-12-07',
        status: 1,
        createdAt: '1734974964.4281',
        updatedAt: '1734974964.4281'
      }
    ],
    pagination: {
      currentPage: PAGINATION_CONFIG.DEFAULT_PAGE,
      totalPage: 2,
      totalRecords: 5
    }
  },
  message: 'Data fetched successfully.'
}

export const orderDetailResponseData: IOrderDetailResponse = {
  status: 200,
  data: {
    id: 1,
    email: 'user@example.com',
    name: 'John Doe',
    phoneNumber: '1234567890',
    address: '123 Main St',
    note: 'Please leave at the door',
    payMethod: 'Credit Card',
    shipDate: '2023-10-10',
    receiveDate: '2023-10-12',
    status: 2,
    totalMoney: 150.0,
    products: [
      {
        id: 1,
        name: 'T-Shirt',
        image: 'http://localhost:5173/src/assets/images/product/shirt.webp',
        color: 'Red',
        size: 'Large',
        quantity: 2,
        price: 50.0
      },
      {
        id: 2,
        name: 'Jeans',
        image: 'http://localhost:5173/src/assets/images/product/shirt.webp',
        color: 'Red',
        size: 'Large',
        quantity: 1,
        price: 100.0
      }
    ]
  },
  message: 'Order details fetched successfully.'
}
