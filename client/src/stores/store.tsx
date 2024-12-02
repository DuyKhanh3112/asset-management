import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux';
import { rootReducer } from './reducers';

// Cấu hình Redux store
const store = configureStore({
    reducer: rootReducer,  // Đặt rootReducer là reducer chính cho store
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false, // Tắt kiểm tra bất biến để tối ưu hóa hiệu suất
        }),
    // Bật Redux DevTools chỉ trong môi trường không phải sản xuất
    devTools: process.env.REACT_APP_NODE_ENV === 'development'
});

// Tạo component DataProvider để bọc ứng dụng với Redux Provider
const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        // Cung cấp Redux store cho tất cả các component con trong ứng dụng
        <Provider store={store}>
            {children}
        </Provider>
    )
}

// Xuất loại cho AppDispatch và RootState để hỗ trợ việc sử dụng dispatch và state với kiểu
export type AppDispatch = typeof store.dispatch;   // Định nghĩa một kiểu cho hàm dispatch
export type RootState = ReturnType<typeof store.getState>;  // Định nghĩa kiểu trạng thái dựa trên cấu trúc trạng thái của store

// Định nghĩa một phiên bản có kiểu của hook dispatch để dễ sử dụng trong toàn bộ ứng dụng
export const useAppDispatch: () => AppDispatch = useDispatch;

// Xuất DataProvider để sử dụng trong ứng dụng
export default DataProvider;
