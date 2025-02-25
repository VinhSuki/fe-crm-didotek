export interface IAccount {
  id: number
  fullName: string
  phoneNumber: string
  email: string
  sex: 'Male' | 'Female' | 'Other'
  status: number
  createdAt: string // ISO Date string
  updatedAt: string // ISO Date string
  role?: IRole
}

export interface IAccountResponse {
  status:number
  message:string
  data:{
    account:IAccount
  }
}

export interface IRole {
  id: number
  name: string
  rolePermissions: IRolePermission[]
}

export interface IRolePermission {
  permission: IPermission
}

export interface IPermission {
  id: number
  name: string
  code: string
}

export interface IJwt {
  accessToken: string
  expireAccessToken: string // ISO Date string
  refreshToken: string
  expireRefreshToken?: string // ISO Date string
}

export interface IAccountLogin {
    account: IAccount
    jwt: IJwt
}
