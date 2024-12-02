import { Spin } from 'antd'; 
import ErrorComponent from 'components/common/ErrorComponemts';
import React, { FC } from 'react';
import { withErrorBoundary } from 'react-error-boundary';

// Định nghĩa props cho component Loading
type LoadingProp = {
  tip?: string; // Thông điệp tải tùy chọn
  size?: "small" | "default" | "large"; // Kích thước tùy chọn của spinner
  children?: React.ReactNode; // Các phần tử con tùy chọn
};

// Định nghĩa component chức năng
const Loading: FC<LoadingProp> = ({
  tip,
  size = 'large', // Kích thước mặc định là 'large'
  children = <></>, // Các phần tử con mặc định là một fragment rỗng
}) => {

  return (
    <Spin 
      tip={tip ?? `Loading.....`} // Sử dụng thông điệp tải đã dịch nếu không cung cấp tip
      size={size} // Đặt kích thước cho spinner
      style={{ position: "fixed", maxHeight: "100vh" }} // Vị trí cố định cho spinner
    >
      {children}
    </Spin>
  );
};

// Xuất component với xử lý ranh giới lỗi
export default withErrorBoundary(Loading, {
  FallbackComponent: ErrorComponent, // Component dự phòng cho việc xử lý lỗi
});
