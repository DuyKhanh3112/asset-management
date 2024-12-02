import { App } from "antd"
import { getErrorMessage } from "helpers/getErrorMessage"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { checkAuthApi } from "services/auth"

type AuthContextType = {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within a AuthProvider'); // Ném lỗi nếu `useAuth` được gọi ngoài `AuthProvider`
    }
    return context; // Trả về `context` nếu đã tồn tại
};

interface AuthProviderProps {
    children: ReactNode; // Các component con sẽ được bao bọc trong AuthProvider
  }

// Định nghĩa component AuthProvider để quản lý trạng thái xác thực và cung cấp cho các component con
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userInfo, setUserInfo]               = useState<any>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const {message}                             = App.useApp()
    const [loading, setLoading]                 = useState<boolean>(false)
    const userId                                = localStorage.getItem('asset_u') 
    
    const checkAuthentication = async() => {
      setLoading(true)
      try {
        if(userId) {
          const response = await checkAuthApi()
          if(response.status === 200) {
            setUserInfo(response.data?.data)
            setIsAuthenticated(true)
          }
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        const msg = getErrorMessage(error)
        message.error(msg)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      checkAuthentication()
    }, [userId])

    const values = {
      isAuthenticated, setIsAuthenticated, 
      loading, setLoading
    };
  
    return (
      <AuthContext.Provider value={values}>
        {children}
      </AuthContext.Provider>
    );
};