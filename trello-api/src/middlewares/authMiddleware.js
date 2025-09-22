// Middleware này sẽ đảm nhiệm việc quan trọng: Xác thực cái Jwt accessToken nhận được từ phía FE có hợp lệ hay không

import { StatusCodes } from "http-status-codes";
import { env } from "~/config/environment";
import { JwtProvider } from "~/providers/JwtProvider";
import ApiError from "~/utils/ApiError";

const isAuthorized = async (req, res, next) => {
  // Lấy accessToken nằm trong request cookies phía client gửi lên - withCredentials trong file authorizeAxios
  const clientAccessToken = req.cookies?.accessToken;

  // Nếu như clientACcessToken không tồn tại thì trả về lỗi luôn
  if (!clientAccessToken) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized! (token not found)")
    );
    return;
  }

  try {
    // 1. Thực hiện giải mã token xem có hợp lệ hay không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    );
    // console.log("🚀 ~ isAuthorized ~ accessTokenDecoded:", accessTokenDecoded);

    // 2. Quan trọng: Nếu như cái token hợp lệ, thì sẽ cần phải lưu thông tin giải mã được vào cái req.JwtDecoded, để sử dụng cho các tầng cần xử lý ở phía sau
    // jwtDecoded là cái chúng ta tự define
    req.jwtDecoded = accessTokenDecoded;

    // 3. Cho phép các request đi tiếp
    next();
  } catch (error) {
    // console.log("🚀 ~ isAuthorized ~ error:", error);

    // Nếu accessToken bị hết hạn (expired) thì mình cần trả về một cái mã lỗi GONE-410 cho phía FE biết để gọi api refreshToken
    if (error?.message?.includes("jwt expired")) {
      next(new ApiError(StatusCodes.GONE, "Need to refresh token."));
      return;
    }

    // Nếu accessToken không hợp lệ do bất kỳ điều gì khác vụ hết hạn thì chúng ta cứ thẳng tay trả về mã 401 cho phía FE gọi api sign_out luôn
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!"));
  }
};

export const authMiddleware = {
  isAuthorized,
};
