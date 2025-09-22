import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formatter";
import { refreshTokenAPI } from "~/apis";
import { logoutUserAPI } from "~/redux/user/userSlice";

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cầu hình chung cho dự án.
let authorizedAxiosInstance = axios.create();

// Thời gian chờ tôi đa của 1 reqquest: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ luu JWT tokens (refresh & access) vao trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true;

// Kỹ thuật: Inject Store
let axiosReduxStore;
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore;
};

export default authorizedAxiosInstance;

// Cấu hình Interceptors (Bộ đánh chặn vào giữa mọi Request và Response)

// Interceptors Request: can thệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // Kĩ thuật chặn spam click
    interceptorLoadingElements(true);
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Khởi tạo một cái promise cho việc gọi api refresh_token
// Mục đích tạo Promise này đề khi nào gọi api refresh_token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó.
// https://www.thedutchlab.com/inzichten/using-axios-interceptors-for-refreshing-your-api-token
let refreshTokenPromise = null;

// Interceptors Response: can thệp vào giữa những cái response nhận về
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Kĩ thuật chặn spam click
    interceptorLoadingElements(false);
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    // Mọi mã http status code nằm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây

    // Kĩ thuật chặn spam click
    interceptorLoadingElements(false);

    /** Xử lý Refresh Token tự động */
    // Trường hợp 1: Nếu như nhận được mã 401 từ BE, thì gọi api đăng xuất
    if (error.response?.status === 401) {
      // Giải pháp: Inject store là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại
      // https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files

      axiosReduxStore.dispatch(logoutUserAPI(false));
    }

    // Trường hợp 2: Nếu nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToken
    // https://www.thedutchlab.com/inzichten/using-axios-interceptors-for-refreshing-your-api-token
    // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
    const originalRequests = error.config;
    // console.log("🚀 ~ originalRequests:", originalRequests);
    if (error.response?.status === 410 && !originalRequests._retry) {
      originalRequests._retry = true;

      // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh_token đồng thời gán vào cho cái refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // đông thời accessToken đã nằm trong httponly cookie (xử lý từ phía BE)
            return data?.accessToken;
          })
          .catch((_error) => {
            // Nếu nhận bất kì lỗi nào từ api refresh token thì cứ logout luôn
            axiosReduxStore.dispatch(logoutUserAPI(false));
            return Promise.reject(_error);
          })
          .finally(() => {
            // Dù API có thành công hay lỗi thì vẫn luôn luôn gán lại refreshTokenPromise về null như ban đầu
            refreshTokenPromise = null;
          });
      }

      // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây
      return refreshTokenPromise.then((accessToken) => {
        /**
         * Bước 1: Đối với Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
         * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi api refreshToken được gọi thành công.
         */
        // Bước 2: Bước Quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để gọi lại những api ban đầu bị lỗi
        return authorizedAxiosInstance(originalRequests);
      });
    }

    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code 1 lần: Clean Code)
    let errorMessage = error?.message;
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message;
    }
    // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình - Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh lại token
    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);
