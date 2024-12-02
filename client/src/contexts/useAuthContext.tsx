import { createContext, ReactNode, useContext, useState } from "react"

type AuthContextType = {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); 

    const values = {
      isAuthenticated, setIsAuthenticated, 
    };
  
    return (
      <AuthContext.Provider value={values}>
        {children}
      </AuthContext.Provider>
    );
};