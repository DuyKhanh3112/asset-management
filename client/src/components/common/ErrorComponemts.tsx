import { colors } from 'constants/color'; 
import styled from 'styled-components'; 

// Định nghĩa kiểu cho thuộc tính của ErrorComponent
type ErrorComponentProps = {
  color: string;           // Màu chữ
  backgroundcolor: string; // Màu nền
}

// Thành phần ErrorComponent
const ErrorComponent = () => {
  return (
    // Sử dụng thành phần ErrorComponentStyled với các thuộc tính màu sắc
    <ErrorComponentStyled color={colors.primary} backgroundcolor={colors.error}>
      Look like component is error
    </ErrorComponentStyled>
  )
}

// Định nghĩa styled component cho ErrorComponent
const ErrorComponentStyled = styled.div<ErrorComponentProps>`
  padding: 1.25rem; // Đặt khoảng đệm cho thành phần
  color: ${(props) => props.color}; // Đặt màu chữ từ props
  background-color: ${(props) => props.backgroundcolor}; // Đặt màu nền từ props
  border-radius: 0.5rem; // Làm tròn các góc của thành phần
`;

// Xuất thành phần ErrorComponent
export default ErrorComponent;
