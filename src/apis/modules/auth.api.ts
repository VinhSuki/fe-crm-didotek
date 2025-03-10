// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { IAccountLogin, IApiResponse, IEmployee } from "@/models/interfaces";
import axiosPrivate from "../client/private.client";
import axiosPublic from "../client/public.client";
// import { accountData } from "@/models/data/accountData";

const authEndpoints = {
  login: "dang-nhap",
  getMe: "thong-tin-dang-nhap",
  refresh: `Auth/RefreshToken`,
  // logout: "dang-xuat",
};

const authApi = {
  async login(username: string, password: string): Promise<IAccountLogin> {
    return await axiosPublic.post(authEndpoints.login, { username, password });
    // throw new Error("username or password wrong");
    // if (username === "admin" && password === "123456") return accountData;
  },
  async getMe(): Promise<IApiResponse<IEmployee>> {
    return await axiosPrivate.get(authEndpoints.getMe);
  },
  // async logout() {
  //   return await axiosPrivate.get(authEndpoints.logout);
  // },
};

export default authApi;
