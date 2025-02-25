import { IEmployee, IEmployeeListResponse } from '../interfaces/employee'

export const employeeListResponseData: IEmployeeListResponse = {
  accounts: [
    {
      id: 1,
      fullName: 'John Doe',
      phoneNumber: '123-456-7890',
      email: 'johndoe@example.com',
      sex: 'Male',
      role: {
        id: 1,
        name: 'Admin',
        rolePermissions: null
      },
      status: 1,
      createdAt: '1734974964.4281',
      updatedAt: '1734974964.4281'
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      phoneNumber: '234-567-8901',
      email: 'janesmith@example.com',
      sex: 'Female',
      role: {
        id: 1,
        name: 'Admin',
        rolePermissions: null
      },
      status: 1,
      createdAt: '1734974964.4281',
      updatedAt: '1734974964.4281'
    },
    {
      id: 3,
      fullName: 'Alice Brown',
      phoneNumber: '345-678-9012',
      email: 'alicebrown@example.com',
      sex: 'Female',
      role: {
        id: 1,
        name: 'Admin',
        rolePermissions: null
      },
      status: 1,
      createdAt: '1734974964.4281',
      updatedAt: '1734974964.4281'
    }
  ],
  pagination: {
    currentPage: PAGINATION_CONFIG.DEFAULT_PAGE,
    totalPage: 2
  }
}

export const employeeResponseData: IEmployee = {
  id: 1,
  fullName: 'John Doe',
  phoneNumber: '123-456-7890',
  password: '1234567',
  email: 'johndoe@example.com',
  sex: 'Male',
  role: {
    id: 1,
    name: 'Admin',
    rolePermissions: null
  },
  status: 1
}
