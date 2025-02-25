import { IAccount, IAccountLogin } from '@/models/interfaces/account';
import { createContext } from 'react';

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  account: IAccount | null // Thông tin người dùng hoặc null nếu chưa đăng nhập
  login: (accountLogin: IAccountLogin) => void // Hàm login
  logout: () => void // Hàm logout
  isAuthenticated: boolean
}

// Tạo context với giá trị mặc định là undefined (nếu chưa có context provider)
const AuthContext = createContext<AuthContextType | null>(null)

export default AuthContext
