import { colors } from 'constants/color'; 
import React, { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import { ConfigProvider } from 'antd';

// Định nghĩa kiểu dữ liệu cho ThemeContext
type ThemeContextType = {
  themeConfig: any; // Cấu hình theme (giao diện) bao gồm màu sắc và các thông số khác
  toggleDarkMode: () => void; // Hàm chuyển đổi chế độ dark mode
}

// Tạo context cho ThemeContext với giá trị khởi tạo là undefined
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook tùy chỉnh để sử dụng ThemeContext
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
    // Nếu ThemeContext chưa được khởi tạo, báo lỗi
  }
  return context; // Trả về context cho các component con
};

// Định nghĩa kiểu dữ liệu cho props của ThemeProvider
interface ThemeProviderProps {
  children: ReactNode; // Các component con sẽ được bao bọc bởi ThemeProvider
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // State để quản lý chế độ dark mode, mặc định là false (chế độ sáng)
  const [darkMode, setDarkMode] = useState(false);

  // Hàm chuyển đổi chế độ dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode); // Đảo ngược trạng thái dark mode
  };

  // Sử dụng useMemo để lưu cấu hình chung của theme (giao diện)
  const themeCommon = useMemo(() => {
    return {
      token: {
        colorPrimary: colors.primary, // Màu chính
        colorSecondary: colors.secondary, // Màu phụ
        colorAccent: colors.accent, // Màu nhấn
        colorBgContainer: darkMode ? colors.backgroundDark : colors.backgroundLight, // Màu nền chính theo chế độ
        colorBgLayout: darkMode ? colors.backgroundDark : colors.backgroundLight, // Màu nền bố cục
        colorTextBase: darkMode ? colors.white : colors.textPrimary, // Màu văn bản chính
        colorTextSecondary: colors.textSecondary, // Màu văn bản phụ
        colorSuccess: colors.success, // Màu thành công
        colorWarning: colors.warning, // Màu cảnh báo
        colorError: colors.error, // Màu lỗi
        borderRadius: 4, // Độ bo tròn của các components,
        colorBorder: colors.border
      }
    }
  }, [darkMode]); // Tính lại mỗi khi trạng thái darkMode thay đổi

  // Sử dụng useMemo để lưu cấu hình cho các thành phần giao diện
  const themeComponent = useMemo(() => {
    return {
      components: {
        Layout: {
          headerBg: darkMode ? colors.backgroundDark : colors.white, // Màu nền của header
          headerColor: darkMode ? colors.white : colors.textPrimary, // Màu văn bản của header
          lightTriggerBg: colors.white
        },
      }
    }
  }, [darkMode]); // Tính lại mỗi khi darkMode thay đổi

  // Kết hợp các cấu hình theme chung và theme cho các thành phần giao diện
  const themeConfig = useMemo(() => {
    return {
      ...themeCommon, // Kết hợp cấu hình chung
      ...themeComponent, // Và cấu hình cho các thành phần
    };
  }, [themeCommon, themeComponent]); // Tính lại khi themeCommon hoặc themeComponent thay đổi

  // Giá trị sẽ được cung cấp cho các component con thông qua context
  const values = {
    themeConfig,
    toggleDarkMode, 
  };

  return (
    <ThemeContext.Provider value={values}>
      <ConfigProvider theme={themeConfig}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
