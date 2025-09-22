import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";
// Khởi tạo giá trị  State của 1 cái Slice trong Redux
const initialState = {
  currentNotifications: null,
};

// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchInvitationsAPI = createAsyncThunk(
  "notifications/fetchInvitationsAPI",
  async () => {
    const respone = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/invitations`
    );
    return respone.data;
  }
);
export const updateBoardInvitationAPI = createAsyncThunk(
  "notifications/updateBoardInvitationAPI",
  async ({ status, invitationId }) => {
    const respone = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/invitations/board/${invitationId}`,
      { status }
    );
    return respone.data;
  }
);

// Khởi tạo 1 Slice trong kho lưu trữ - Redux Store
export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  // Reducers Nơi xử lý dữ liệu đồng bộ
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null;
    },

    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload;
    },

    addNotifications: (state, action) => {
      const incomingInvitation = action.payload;
      // unshift thêm một phần tử vào đầu mảng
      state.currentNotifications.unshift(incomingInvitation);
    },
  },

  // extraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là respone.data trả về bởi fetchInvitationsAPI
      let incomingInvitations = action.payload;
      // Đảo ngược mảng invitations nhận được, để hiển thị cái mới nhất lên đầu
      state.currentNotifications = Array.isArray(incomingInvitations)
        ? incomingInvitations.reverse()
        : [];
    });
    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là respone.data trả về bởi updateBoardInvitationAPI
      const incomingInvitation = action.payload;
      // Cập nhật lại dữ liệu boardInvitation ( bên trong nó sẽ có Status mới sau khi update)
      const getInvitation = state.currentNotifications.find(
        (i) => i._id === incomingInvitation._id
      );
      getInvitation.boardInvitation = incomingInvitation.boardInvitation;
    });
  },
});

// Action creators are generated for each case reducer function
// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cặp nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer
export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotifications,
} = notificationsSlice.actions;

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook ueSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectorCurrentNotifications = (state) => {
  return state.notifications.currentNotifications;
};

export const notificationsReducer = notificationsSlice.reducer;
