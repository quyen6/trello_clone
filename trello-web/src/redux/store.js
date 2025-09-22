// Redux: State management tool
import { configureStore } from "@reduxjs/toolkit";
import { activeBoardReducer } from "./activeBoard/activeBoardSlice";
import { userReducer } from "./user/userSlice";

/**
 * Cấu hình redux-persist
 * https://www.npmjs.com/package/redux-persist
 * Bài viết hướng dẫn về hiểu hơn
 * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 */
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import { activeCardReducer } from "./activeCard/activeCardSlice";
import { notificationsReducer } from "./notifications/notificationsSlice";

// Cấu hình persist
const rootPersistConfig = {
  key: "root", // key của cái persist do chúng ta chỉ định, để mặc định là root
  storage, // Biến storage ở trên - lưu vào localstorage
  whitelist: ["user"], // định nghĩa các slice dữ liệu ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
  // blacklist: ["user"] // định nghĩa các slice KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
};
// Combine các reducers trong dự án của chúng ta ở đây
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer,
});
// Thực hiện persist Reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,

  // Fix warning error when implement redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
