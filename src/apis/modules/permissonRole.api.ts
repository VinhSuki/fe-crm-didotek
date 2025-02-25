// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { permissionData } from '@/models/data/permissionData'
import { roleData } from '@/models/data/roleData'
import { IPermission, IPermissionRoles, IRole } from '@/models/interfaces/permissionRole'
import axiosPrivate from '../client/private.client'
import { IApiResponse } from '@/models/interfaces/api'
// import { IPermissionRole } from '@/models/interfaces/permissionRole'

const permissionRoleEndpoints = {
  rolesList: 'Role',
  permissionList: 'Role/Permissions',
  decentralize: 'Role/Decentralize'
}

const permissionRoleApi = {
  async getRoleList(): Promise<IApiResponse<{ roles: IRole[] }>> {
    return axiosPrivate.get(permissionRoleEndpoints.rolesList)
  },
  async getPermissionList(): Promise<IApiResponse<IPermission[]>> {
    return axiosPrivate.get(permissionRoleEndpoints.permissionList)
  },
  async decentralize(data: IPermissionRoles): Promise<IApiResponse<{ roles: IRole[] }>> {
    return axiosPrivate.put(permissionRoleEndpoints.decentralize,{...data})
  }
}

export default permissionRoleApi
