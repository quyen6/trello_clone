import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";
// Khởi tạo giá trị  State của 1 cái Slice trong Redux
const initialState = {
  currentUser: null,
};

// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  "user/loginUserAPI",
  async (data) => {
    const respone = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    );
    return respone.data;
  }
);
export const logoutUserAPI = createAsyncThunk(
  "user/logoutUserAPI",
  async (showSuccessMessage = true) => {
    const respone = await authorizedAxiosInstance.delete(
      `${API_ROOT}/v1/users/logout`
    );
    if (showSuccessMessage) {
      toast.success("Logged out successfully!");
    }
    return respone.data;
  }
);
export const updateUserAPI = createAsyncThunk(
  "user/updateUserAPI",
  async (data) => {
    const respone = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/users/update`,
      data
    );
    return respone.data;
  }
);

// Khởi tạo 1 Slice trong kho lưu trữ - Redux Store
export const userSlice = createSlice({
  name: "user",
  initialState,
  // Reducers Nơi xử lý dữ liệu đồng bộ
  reducers: {},

  // extraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là respone.data trả về bởi loginUserAPI
      let user = action.payload;

      // Update lại dữ liệu của currentUser
      state.currentUser = user;
    });

    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      /**
       * API logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
       * Kết hợp ProtectedRoute đã làm ở App.js => code sẽ điều hướng tới trang login
       */
      state.currentUser = null;
    });

    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload;
      state.currentUser = user;
    });
  },
});

// Action creators are generated for each case reducer function
// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cặp nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer
// export const {  } = userSlice.actions;

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook ueSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectorCurrentUser = (state) => {
  return state.user.currentUser;
};

export const userReducer = userSlice.reducer;
