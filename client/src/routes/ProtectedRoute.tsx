import ErrorComponent from 'components/common/ErrorComponemts';
import { useAuth } from 'contexts/useAuthContext';
import React, { FC } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { Navigate } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu cho props của ProtectedRoute
type ProtectedRouteProps = {
    children: React.ReactNode; // Các component con được truyền vào
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
    // Lấy trạng thái xác thực từ context
    const { isAuthenticated } = useAuth();

    // Kiểm tra trạng thái xác thực
    return isAuthenticated ? <Navigate to="/" /> : <>{children}</>;
}

export default withErrorBoundary(ProtectedRoute, {
    FallbackComponent: ErrorComponent
});
