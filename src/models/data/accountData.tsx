import { IAccountLogin } from "@/models/interfaces/account";

export const accountData: IAccountLogin = {
    account: {
      id: 1,
      fullName: "Nguyễn Văn A",
      phoneNumber: "0987654321",
      email: "nguyenvana@example.com",
      sex: "Male",
      status: 1,
      createdAt: "2024-02-24T12:00:00Z",
      updatedAt: "2024-02-24T12:30:00Z",
    },
    jwt: {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      expireAccessToken: "2024-02-25T12:00:00Z",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      expireRefreshToken: "2024-03-01T12:00:00Z",
    },
  };
  