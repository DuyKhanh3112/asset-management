import ErrorComponent from 'components/common/ErrorComponemts';
import { useAuth } from 'contexts/useAuthContext';
import { withErrorBoundary } from 'react-error-boundary';
import { Navigate, Outlet } from 'react-router-dom';


// Thành phần AuthRequired kiểm tra xem người dùng đã xác thực chưa
const AuthRequired = () => {
    const { isAuthenticated } = useAuth(); // Lấy trạng thái xác thực từ context
    const userId = localStorage.getItem('asset_u')

    return (
        isAuthenticated && userId
            ? <Outlet />
            : <Navigate to={"/login"} />
    )
}

export default withErrorBoundary(AuthRequired, {
    FallbackComponent: ErrorComponent,
});
