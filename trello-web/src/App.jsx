import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useOutletContext,
} from "react-router-dom";
import Board from "~/pages/Boards/_id";
import NotFound from "~/pages/404/NotFound";
import Auth from "~/pages/Auth/Auth";
import AccountVerification from "~/pages/Auth/AccountVerification";
import { useSelector } from "react-redux";
import { selectorCurrentUser } from "~/redux/user/userSlice";
import Settings from "./pages/Settings/Settings";
import MainLayout from "./MainLayout";
import Boards from "./pages/Boards";

/**
 * Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập
 * Sử dụng <Outlet /> của react-router-dom để hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
 * https://reactrouter.com/en/main/components/outlet
 * Một bài hướng dẫn khá đầy đủ:
 * https://www.robinwieruch.de/react-router-private-routes/
 */
const ProtectedRoute = ({ user }) => {
  const outletContext = useOutletContext(); // lấy từ MainLayout // Fix lấy  resolvedMode truyền từ <Outlet/> MainLayout
  if (!user) return <Navigate to="/login" replace={true} />;
  return <Outlet context={outletContext} />; // Fix lấy  resolvedMode truyền từ <Outlet/> MainLayout
};

function App() {
  const currentUser = useSelector(selectorCurrentUser);
  return (
    <Routes>
      {/* Layout bọc AppBar */}
      <Route element={<MainLayout />}>
        {/* Redirect Route */}
        <Route
          path="/"
          element={
            // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm trong history của Browser
            // Thực hành dễ hiều hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace hoặc không có
            <Navigate to="/boards" replace={true} />
          }
        />
        {/* ProtectedRoute (Hiểu đơn giản trong dự án của chúng ta là những route chỉ cho truy cập sau khi đã login) */}
        <Route element={<ProtectedRoute user={currentUser} />}>
          {/* <Outlet /> của react router dom sẽ chạy vào các child route trong này */}

          {/* React Router Dom /boards /boards/{board_id} */}
          <Route path="/boards/:boardId" element={<Board />} />
          <Route path="/boards" element={<Boards />} />

          {/* User Setting */}

          <Route path="/settings/account" element={<Settings />} />
          <Route path="/settings/security" element={<Settings />} />
        </Route>
      </Route>

      {/* Route không dùng AppBar (ví dụ Login, Register) */}
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />

      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
    </Routes>
  );
}

export default App;
