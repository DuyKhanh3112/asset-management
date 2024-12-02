import { combineReducers } from "redux"; 
import authReducer from './auth'; 

// Định nghĩa rootReducer bằng cách kết hợp tất cả các reducer, ví dụ như authReducer, thành một reducer gốc duy nhất
export const rootReducer = combineReducers({
  auth: authReducer, // Kết hợp authReducer vào rootReducer với khóa là 'auth'
});

// Định nghĩa kiểu RootState bằng cách sử dụng ReturnType để suy luận kiểu từ rootReducer,
// để TypeScript biết được cấu trúc của trạng thái trong store Redux của chúng ta
export type RootState = ReturnType<typeof rootReducer>; // Định nghĩa kiểu trạng thái của store dựa trên rootReducer
