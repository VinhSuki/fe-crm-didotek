import { IRole } from '../interfaces/permissionRole'

export const roleData: IRole[] = [
  {
    id: 1,
    name: 'Admin',
    permissions: [
      { id: 1, name: 'View Users', code: 'VIEW_USERS', description: 'Allows viewing user details' },
      { id: 2, name: 'Edit Users', code: 'EDIT_USERS', description: 'Allows editing user details' }
    ]
  },
  {
    id: 2,
    name: 'SuperAdmin',
    permissions: [
      { id: 1, name: 'View Users', code: 'VIEW_USERS', description: 'Allows viewing user details' },
      { id: 2, name: 'Edit Users', code: 'EDIT_USERS', description: 'Allows editing user details' },
      { id: 3, name: 'Delete Users', code: 'DELETE_USERS', description: 'Allows deleting user details' }
    ]
  },
  {
    id: 3,
    name: 'Creator',
    permissions: [{ id: 1, name: 'View Users', code: 'VIEW_USERS', description: 'Allows viewing user details' }]
  },
  { id: 4, name: 'Product Management', permissions: [] }
]
