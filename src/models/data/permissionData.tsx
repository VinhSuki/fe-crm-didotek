import { IPermission } from '../interfaces/permissionRole'

export const permissionData: IPermission[] = [
  { id: 1, name: 'View Users', code: 'VIEW_USERS', description: 'Allows viewing user details' },
  { id: 2, name: 'Edit Users', code: 'EDIT_USERS', description: 'Allows editing user details' },
  { id: 3, name: 'Delete Users', code: 'DELETE_USERS', description: 'Allows deleting user details' },
  { id: 4, name: 'Create Users', code: 'CREATE_USERS', description: 'Allows creating new users' },
  { id: 5, name: 'View Roles', code: 'VIEW_ROLES', description: 'Allows viewing roles' },
  { id: 6, name: 'Edit Roles', code: 'EDIT_ROLES', description: 'Allows editing roles' },
  { id: 7, name: 'Delete Roles', code: 'DELETE_ROLES', description: 'Allows deleting roles' },
  { id: 8, name: 'Assign Roles', code: 'ASSIGN_ROLES', description: 'Allows assigning roles to users' },
  { id: 9, name: 'View Permissions', code: 'VIEW_PERMISSIONS', description: 'Allows viewing permissions' },
  { id: 10, name: 'Edit Permissions', code: 'EDIT_PERMISSIONS', description: 'Allows editing permissions' },
  { id: 11, name: 'Delete Permissions', code: 'DELETE_PERMISSIONS', description: 'Allows deleting permissions' },
  { id: 12, name: 'Access Reports', code: 'ACCESS_REPORTS', description: 'Allows accessing reports' },
  { id: 13, name: 'Generate Reports', code: 'GENERATE_REPORTS', description: 'Allows generating reports' },
  { id: 14, name: 'View Logs', code: 'VIEW_LOGS', description: 'Allows viewing system logs' },
  { id: 15, name: 'Manage Settings', code: 'MANAGE_SETTINGS', description: 'Allows managing application settings' },
];

