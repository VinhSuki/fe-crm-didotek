import axiosPrivate from '@/apis/client/private.client'
import authApi from '@/apis/modules/auth.api'
import Loader from '@/components/common/Loader'
import { IAccount, IAccountLogin, IAccountResponse, IJwt } from '@/models/interfaces/account'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../AuthContext'

// Định nghĩa kiểu dữ liệu cho props của AuthProvider
interface AuthProviderProps {
  children: React.ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [account, setAccount] = useState<IAccount | null>(null) // Khởi tạo user với giá trị null
  const [loading, setLoading] = useState<boolean>(true) // Trạng thái loading khi gọi API
  const navigate = useNavigate()

  // Hàm signin nhận dữ liệu user, accessToken và refreshToken
  const login = (accountLogin: IAccountLogin) => {
    const { account, jwt } = accountLogin
    const expireAccessToken = new Date(jwt.expireAccessToken)
    const expireRefreshToken = new Date(jwt.expireRefreshToken || '')
    console.log(expireAccessToken, expireRefreshToken)
    // Lưu các token vào cookie với thời gian hết hạn
    Cookies.set('accessToken', jwt.accessToken, { expires: expireAccessToken })
    Cookies.set('refreshToken', jwt.refreshToken, { expires: expireRefreshToken })
    Cookies.set('expireAccessToken', jwt.accessToken)
    Cookies.set('expireRefreshToken', jwt.refreshToken)

    setIsAuthenticated(true)
    setAccount(account)
    navigate('/') // Điều hướng về trang chính sau khi đăng nhập thành công
  }

  // Hàm logout
  const logout = () => {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('expireAccessToken')
    Cookies.remove('expireRefreshToken')
    setIsAuthenticated(false)
    setAccount(null) // Reset user về null khi logout
    navigate('/login') // Điều hướng về trang đăng nhập
  }

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const accessToken = Cookies.get('accessToken')
        const refreshToken = Cookies.get('refreshToken')
        if (accessToken) {
          const dataAccount = await authApi.getMe()
          setAccount(dataAccount.data.account)
          setIsAuthenticated(true)
          return
        }
        if (refreshToken) {
          const { jwt }: { jwt: IJwt } = await axiosPrivate.post(`Auth/RefreshToken`, { refreshToken })
          const expireRefreshToken = Cookies.get('expireRefreshToken')
          if (expireRefreshToken) {
            Cookies.set('accessToken', jwt.accessToken, { expires: new Date(jwt.expireAccessToken) })
            Cookies.set('expireAccessToken', jwt.expireAccessToken)
            Cookies.set('refreshToken', jwt.refreshToken, { expires: new Date(expireRefreshToken) })
            const dataAccount = await authApi.getMe()
            setAccount(dataAccount.data.account)
            setIsAuthenticated(true)
            return
          }
        }
        navigate('/login') // Only navigate if no valid tokens
      } catch (error) {
        console.error('Error fetching user data:', error)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    if (!account) fetchApi()
  }, [account, navigate])

  if (loading) {
    return <Loader /> // Hiển thị loading trong khi đang kiểm tra token
  }

  return <AuthContext.Provider value={{ account, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
}

export default AuthProvider
