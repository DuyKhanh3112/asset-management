import { ActionHandler, ActionType, DataStoreType } from "typings";
import { reducerHandler } from "../common";
import { actionCreator } from "stores/actions";

const getCompanies = actionCreator("GET_COMPANIES");
const changeCompany = actionCreator("CHANGE_COMPANY");


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
const companyReducer = <T extends string, D>(
    state = initialState, // Trạng thái khởi tạo
    action: GroupAction<T, D> // Action được truyền vào
) => {
    switch (action.type) {
        // Xử lý các action liên quan đến xác thực
        case getCompanies.REQUEST:
        case getCompanies.SUCCESS:
        case getCompanies.FAILURE:
            return reducerHandler(state, action, getCompanies as ActionHandler<"GET_COMPANIES">);

        case changeCompany.REQUEST:
        case changeCompany.SUCCESS:
        case changeCompany.FAILURE:
            return reducerHandler(state, action, getCompanies as ActionHandler<"CHANGE_COMPANY">);

        default:
            return state; // Trả về trạng thái hiện tại nếu không khớp với bất kỳ trường hợp nào
    }
};

export default companyReducer; // Xuất reducer để sử dụng ở nơi khác