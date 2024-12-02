import { ActionType } from "typings";

export const actionCreator = <T extends string>(action: T) => {
  // Mảng các trạng thái để gắn thêm vào tên action
  const values = ["SUCCESS", "FAILURE", "REQUEST"] as const;

  const types = values.reduce((acc, value) => {
    // Tạo ra một tên type từ action và giá trị trạng thái, ví dụ "LOGIN_SUCCESS"
    const type = `${action}_${value}` as ActionType<T>[typeof value];

    // Thêm thuộc tính cho action type (ví dụ: SUCCESS, FAILURE, REQUEST)
    acc[value] = type;

    // Tạo hàm action creator dựa trên tên trạng thái (success, failure, request)
    // Hàm này trả về đối tượng action có `type` và `payload`
    acc[value.toLowerCase()] = (payload: any) => ({
      type,       // Action type, ví dụ: "LOGIN_SUCCESS"
      payload,    // Payload của action
    });
    
    return acc;
  }, {} as Record<string, any>); // Khởi tạo acc là một đối tượng rỗng, kiểu Record<string, any>

  return types; // Trả về các loại action và hàm tạo action
};