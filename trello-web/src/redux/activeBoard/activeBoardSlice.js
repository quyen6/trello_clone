import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";
import { generatePlaceholderCard } from "~/utils/formatter";
import { isEmpty } from "lodash";
// Khởi tạo giá trị  State của 1 cái Slice trong Redux
const initialState = {
  currentActiveBoard: null,
};

// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  "activeBoard/fetchBoardDetailsAPI",
  async (boardId) => {
    const respone = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`
    );
    return respone.data;
  }
);

// Khởi tạo 1 Slice trong kho lưu trữ - Redux Store
export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  // Reducers Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      const board = action.payload;

      // Xử ly dữ liệu nếu cần thiết ...
      // ...

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board;
    },
    clearCurrentActiveBoard: (state) => {
      state.currentActiveBoard = null;
    },

    // Cập nhật Card trong Board
    // https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
    updateCardInBoard: (state, action) => {
      // Update nested data
      const imcomingCard = action.payload;
      // Tìm dần từ Board > Column > Card
      const column = state.currentActiveBoard.columns.find(
        (i) => i._id === imcomingCard.columnId
      );
      if (column) {
        const card = column.cards.find((i) => i._id === imcomingCard._id);
        if (card) {
          // card.title = imcomingCard.title;
          // card.["title"] = imcomingCard.["title"];

          // Object.keys sẽ lấy toàn bộ các properties (keys) của imcomingCard về 1 Array rồi forEach ra
          Object.keys(imcomingCard).forEach((key) => {
            card[key] = imcomingCard[key];
          });
        }
      }
    },
  },

  // extraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là respone.data trả về bởi fetchBoardDetailsAPI
      let board = action.payload;

      // Thành viên trong Board là tất cả thành viên từ 2 mảng owners và members
      board.FE_allUsers = board.owners.concat(board.members);

      board.columns.forEach((column) => {
        // Khi f5 trang web thì cần xử lý vấn đề kéo thả vào 1 column rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        }
      });

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board;
    });
  },
});

// Action creators are generated for each case reducer function
// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cặp nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer
export const {
  updateCurrentActiveBoard,
  clearCurrentActiveBoard,
  updateCardInBoard,
} = activeBoardSlice.actions;

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook ueSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectorCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard;
};

export const activeBoardReducer = activeBoardSlice.reducer;
