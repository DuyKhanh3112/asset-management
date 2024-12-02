/** @format */

import { ActionHandler, ActionType } from "typings";


// Định nghĩa kiểu Action với ba tham số: T (type), D (data), E (error)
type Action<T extends string, D, E> = { 
  type: keyof ActionType<T>; // Kiểu của action.type dựa trên ActionType
  payload?: D; // Tham số payload, chứa dữ liệu cần truyền
  error?: E; // Tham số error, chứa thông tin lỗi nếu có
};

// Định nghĩa kiểu State với hai tham số: D (data), E (error)
type State<D, E> = { 
  isLoading: boolean; // Biến xác định trạng thái đang tải hay không
  loaded: boolean; // Biến xác định trạng thái đã tải hay chưa
  data: D | null; // Dữ liệu, có thể là loại D hoặc null nếu chưa có dữ liệu
  error: E | null; // Thông tin lỗi, có thể là loại E hoặc null nếu không có lỗi
};

// Hàm reducerHandler nhận vào state, action và actionHandler, trả về trạng thái mới
export function reducerHandler<T extends string, D, E>(
  state: State<D, E>, // Trạng thái hiện tại
  action: Action<T, D, E>, // Action được truyền vào
  actionHandler: ActionHandler<T> // Hàm xử lý các loại action
): State<D, E> {
  switch (action.type) {
    case actionHandler.REQUEST: // Khi action là REQUEST
      return { 
        ...state, // Giữ nguyên trạng thái hiện tại
        isLoading: true, // Đặt isLoading thành true
        loaded: false, // Đặt loaded thành false
        error: null // Đặt error thành null vì chưa có lỗi
      };
    case actionHandler.SUCCESS: // Khi action là SUCCESS
      return { 
        ...state, // Giữ nguyên trạng thái hiện tại
        isLoading: false, // Đặt isLoading thành false
        loaded: true, // Đặt loaded thành true
        data: action.payload as D, // Cập nhật dữ liệu với payload từ action
        error: null // Đặt error thành null vì không có lỗi
      };
    case actionHandler.FAILURE: // Khi action là FAILURE
      return { 
        ...state, // Giữ nguyên trạng thái hiện tại
        isLoading: false, // Đặt isLoading thành false
        loaded: true, // Đặt loaded thành true vì đã hoàn thành tải
        error: action.payload as E // Cập nhật lỗi với payload từ action
      };
    default: // Nếu action không khớp với bất kỳ trường hợp nào ở trên
      return state; // Trả về trạng thái hiện tại mà không thay đổi
  }
}