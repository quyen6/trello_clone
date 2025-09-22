import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo giá trị  State của 1 cái Slice trong Redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false,
};

// Khởi tạo 1 Slice trong kho lưu trữ - Redux Store
export const activeCardSlice = createSlice({
  name: "activeCard",
  initialState,
  // Reducers Nơi xử lý dữ liệu đồng bộ
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true;
    },
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null;
      state.isShowModalActiveCard = false;
    },
    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload;

      state.currentActiveCard = fullCard;
    },
  },

  // extraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    //
  },
});

// Action creators are generated for each case reducer function
// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cặp nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer
export const {
  showModalActiveCard,
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
} = activeCardSlice.actions;

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook ueSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectorActiveCard = (state) => {
  return state.activeCard.currentActiveCard;
};
export const selectorIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard;
};

export const activeCardReducer = activeCardSlice.reducer;
