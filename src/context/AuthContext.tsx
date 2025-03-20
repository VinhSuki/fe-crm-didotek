/* eslint-disable @typescript-eslint/no-explicit-any */
import authApi from "@/apis/modules/auth.api";
import Loader from "@/components/common/Loader";
import { IAccountLogin, IEmployee } from "@/models/interfaces";
import { showErrorAlert } from "@/utils/alert";
import Cookies from "js-cookie";
import { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Định nghĩa kiểu dữ liệu cho props của AuthProvider
interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  account: IEmployee | null; // Thông tin người dùng hoặc null nếu chưa đăng nhập
  login: (accountLogin: IAccountLogin) => void; // Hàm login
  logout: () => void; // Hàm logout
  isAuthenticated: boolean;
  checkPermission: (permission: string) => boolean;
}

// Tạo context với giá trị mặc định là undefined (nếu chưa có context provider)
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [account, setAccount] = useState<IEmployee | null>(null); // Khởi tạo user với giá trị null
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading khi gọi API
  const navigate = useNavigate();

  // Hàm signin nhận dữ liệu user, accessToken và refreshToken
  const login = async (accountLogin: IAccountLogin) => {
    // const { account, jwt } = accountLogin
    // const expireAccessToken = new Date(jwt.expireAccessToken)
    // const expireRefreshToken = new Date(jwt.expireRefreshToken || '')
    // console.log(expireAccessToken, expireRefreshToken)
    // // Lưu các token vào cookie với thời gian hết hạn
    // Cookies.set('accessToken', jwt.accessToken, { expires: expireAccessToken })
    // Cookies.set('refreshToken', jwt.refreshToken, { expires: expireRefreshToken })
    // Cookies.set('expireAccessToken', jwt.accessToken)
    // Cookies.set('expireRefreshToken', jwt.refreshToken)
    console.log(accountLogin);
    const { token } = accountLogin;
    Cookies.set("token", token);
    try {
      const res = await authApi.getMe();
      const data = res.data?.data;
      console.log(data);
      if (data) {
        setAccount(data ?? null);
        setIsAuthenticated(true);
        setPermissions(data.quyen ?? []);
      }
      navigate("/"); // Điều hướng về trang chính sau khi đăng nhập thành công
    } catch (error: any) {
      showErrorAlert(error.message);
    }
  };

  // Hàm logout
  const logout = async () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setAccount(null); // Reset user về null khi logout
    navigate("/dang-nhap"); // Điều hướng về trang đăng nhập
  };

  const checkPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const token = Cookies.get("token");
        // const accessToken = Cookies.get('accessToken')
        // const refreshToken = Cookies.get('refreshToken')
        if (token) {
          const res = await authApi.getMe();
          const data = res.data?.data;
          if (data) {
            console.log(data?.quyen);
            setAccount(data ?? null);
            setIsAuthenticated(true);
            setPermissions(data.quyen ?? []);
          }
          return;
        }
        // if (refreshToken) {
        //   const { jwt }: { jwt: IJwt } = await axiosPrivate.post(`Auth/RefreshToken`, { refreshToken })
        //   const expireRefreshToken = Cookies.get('expireRefreshToken')
        //   if (expireRefreshToken) {
        //     Cookies.set('accessToken', jwt.accessToken, { expires: new Date(jwt.expireAccessToken) })
        //     Cookies.set('expireAccessToken', jwt.expireAccessToken)
        //     Cookies.set('refreshToken', jwt.refreshToken, { expires: new Date(expireRefreshToken) })
        //     const dataAccount = await authApi.getMe()
        //     setAccount(dataAccount.data.account)
        //     setIsAuthenticated(true)
        //     return
        //   }
        // }
        navigate("/dang-nhap"); // Only navigate if no valid tokens
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/dang-nhap");
      } finally {
        setLoading(false);
      }
    };
    if (!account) fetchApi();
  }, [account, navigate]);

  if (loading) {
    return <Loader />; // Hiển thị loading trong khi đang kiểm tra token
  }

  return (
    <AuthContext.Provider
      value={{ account, login, logout, isAuthenticated, checkPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
