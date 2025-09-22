import JWT from "jsonwebtoken";
/**
 *Function tạo mới một token - cần 3 tham số đầu vào
 *userInfo: Những thông tin muốn đính kèm vào token
 *secretSignature: Chữ ký bí mật (dạng một chuỗi string ngẫu nhiên) trên docs thì đề tên là privateKey tùy đều được
 *tokenLife: Thời gian sống của token
 */
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    // Hàm sign của jwt - Thuật toán mặc định kaf HS256, cứ cho vào code để dễ nhìn
    return JWT.sign(userInfo, secretSignature, {
      algorithm: "HS256",
      expiresIn: tokenLife,
    });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 *Function kiểm tra một token có hợp lệ hay không
 *Hợp lệ ở đây hiểu đơn giản là cái token được tạo ra có đúng với các chữ kí bí mật seccretSignature trong dự án hay không
 */
const verifyToken = (token, secretSignature) => {
  try {
    // Hàm verify của Jwt
    return JWT.verify(token, secretSignature);
  } catch (error) {
    throw new Error(error);
  }
};

export const JwtProvider = {
  generateToken,
  verifyToken,
};
