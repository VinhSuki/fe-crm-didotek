// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { IAccountLogin, IAccountResponse } from "@/models/interfaces/account";
import axiosPrivate from "../client/private.client";
import axiosPublic from "../client/public.client";
import { accountData } from "@/models/data/accountData";

const authEndpoints = {
  login: "Auth/Login",
  getMe: "Auth/GetMe",
  refresh: `Auth/RefreshToken`,
};

const authApi = {
  async login(username: string, password: string): Promise<IAccountLogin> {
    // return await axiosPublic.post(authEndpoints.login, { username, password })
    if (username === "admin" && password === "123456") return accountData;
    throw new Error("username or password wrong");
  },
  getMe(): Promise<IAccountResponse> {
    return axiosPrivate.get(authEndpoints.getMe);
  },
};

export default authApi;
