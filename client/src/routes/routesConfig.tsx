import Asset from "pages/asset/Asset";
import AssetAudit from "pages/asset/components/assetAudit/Index";
import AssetDetail from "pages/asset/components/assetDetail/AssetDetail";
import AuditDetail from "pages/asset/components/auditDetail/Index";
import Login from "pages/authentication/Login";
import ProtectedRoute from "./ProtectedRoute";
import AuthRequired from "pages/authentication/AuthRequired";


export const routesConfig = [
  {
    path: '/', // Đường dẫn chính
    element: <AuthRequired />, // Yêu cầu xác thực cho đường dẫn này
    children: [
      {
        path: "",
        element: <Asset />
      },
      {
        path: "/asset/:id",
        element: <AssetDetail />
      },
      {
        path: "/asset/audit",
        element: <AssetAudit />
      },
      {
        path: "/asset/audit/:id",
        element: <AuditDetail />
      },
    ]
  },
  {
    path: "/login", // Đường dẫn cho trang đăng nhập
    element: (
      <ProtectedRoute> {/* Bọc trong ProtectedRoute để bảo vệ route */}
        <Login /> {/* Hiển thị trang đăng nhập */}
      </ProtectedRoute>
    )
  },
  // { path: "*", element: <NotFound /> } // Đường dẫn không hợp lệ, hiển thị trang NotFound
]