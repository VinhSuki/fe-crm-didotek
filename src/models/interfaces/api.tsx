export interface IApiResponse<T = undefined> {
  status: number;
  message: string;
  data?: T;
}
