// export interface IPermissionRole {
//   roleId: number | string
//   permissionId: number | string
// }

export interface IPermission {
  id:number
  name: string
  code?: string
  description?: string
}

export interface IRole {
  id: number
  name: string
  permissions:IPermission[]
}

export interface IPermissionRoles {
  roleId: number
  permissions: number[]
}