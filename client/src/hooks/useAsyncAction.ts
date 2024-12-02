import { useCallback, useState } from 'react';
import { App } from 'antd';
import { AppDispatch, useAppDispatch } from 'stores/store';
import { getErrorMessage } from 'helpers/getErrorMessage';

// Hook tùy chỉnh để thực hiện các tác vụ bất đồng bộ
const useAsyncAction = () => {
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const dispatch = useAppDispatch(); // Lấy hàm dispatch từ Redux
    const { message } = App.useApp(); // Hook để hiển thị thông báo

    // Hàm thực hiện hành động bất đồng bộ
    const executeAction = useCallback(
        async <T>(
            action: () => (dispatch: AppDispatch) => Promise<T>, // Hàm hành động trả về hàm nhận dispatch
            isMessage?: boolean // Thông báo tùy chọn
        ): Promise<boolean> => {
            setLoading(true); // Bắt đầu trạng thái loading
            try {
                const result: T = await dispatch(action()); // Gọi hành động và chờ kết quả
                // Kiểm tra kết quả và hiển thị thông báo tương ứng
                if (result && (result as any)?.success) {
                    isMessage && (result as any)?.message && message.success((result as any)?.message)
                    return true; // Trả về true nếu thành công
                } else {
                    isMessage && message.error((result as any)?.message)
                    return false; // Trả về false nếu không thành công
                }
            } catch (error) {
                const msg = getErrorMessage(error);
                message.error(msg); // Xử lý lỗi nếu có
                return false; // Trả về false khi có lỗi
            } finally {
                setLoading(false); // Kết thúc trạng thái loading
            }
        },
        [dispatch, message] // Các phụ thuộc cần thiết
    );

    // Trả về trạng thái loading và hàm executeAction
    return { loading, executeAction };
};

export default useAsyncAction; // Xuất hook
