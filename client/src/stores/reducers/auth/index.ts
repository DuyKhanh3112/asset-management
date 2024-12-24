import { ActionHandler, ActionType, DataStoreType } from "typings";
import { reducerHandler } from "../common";
import { actionCreator } from "stores/actions";

const loginAction = actionCreator("LOGIN");
const checkAuthAction = actionCreator("CHECK_AUTH");
const logout = actionCreator("LOGOUT");

// Định nghĩa trạng thái khởi tạo cho reducer
const initialState: DataStoreType = {
  isLoading: false, // Trạng thái chưa tải
  loaded: false, // Trạng thái chưa được tải
  data: null, // Dữ liệu khởi tạo là null
  error: null // Thông tin lỗi khởi tạo là null
};

// Định nghĩa kiểu GroupAction với hai tham số: T cho loại action và D cho dữ liệu
type GroupAction<T extends string, D> = {
  type: keyof ActionType<T>; // Kiểu của action.type dựa trên ActionType
  data?: D; // Dữ liệu liên quan đến action
};

// Định nghĩa reducer authReducer
const authReducer = <T extends string, D>(
  state = initialState, // Trạng thái khởi tạo
  action: GroupAction<T, D> // Action được truyền vào
) => {
  switch (action.type) {
    // Xử lý các action liên quan đến xác thực
    case loginAction.REQUEST:
    case loginAction.SUCCESS:
    case loginAction.FAILURE:
      return reducerHandler(state, action, loginAction as ActionHandler<"LOGIN">);

    case checkAuthAction.REQUEST:
    case checkAuthAction.SUCCESS:
    case checkAuthAction.FAILURE:
      return reducerHandler(state, action, checkAuthAction as ActionHandler<"CHECK_AUTH">);

    case logout.REQUEST:
    case logout.SUCCESS:
    case logout.FAILURE:
      return reducerHandler(state, action, logout as ActionHandler<"LOGOUT">);



    default:
      return state; // Trả về trạng thái hiện tại nếu không khớp với bất kỳ trường hợp nào
  }
};

export default authReducer; // Xuất reducer để sử dụng ở nơi khác