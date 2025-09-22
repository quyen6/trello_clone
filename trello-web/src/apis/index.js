import { toast } from "react-toastify";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";

/* Boards */
// Đã move vào Redux
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const respone = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);

//   return respone.data;
// };
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const respone = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  );

  return respone.data;
};
export const moveCardToDifferentColumnAPI = async (updateData) => {
  const respone = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  );

  return respone.data;
};

export const fetchBoardsAPI = async (searchPath) => {
  const respone = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/boards${searchPath}`
  );

  return respone.data;
};

export const createNewBoardAPI = async (data) => {
  const respone = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/boards`,
    data
  );
  toast.success("Board created successfully!");

  return respone.data;
};

/* Columns */
export const createNewColumnAPI = async (newColumnData) => {
  const respone = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/columns`,
    newColumnData
  );

  return respone.data;
};
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const respone = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  );

  return respone.data;
};
export const deleteColumnDetailsAPI = async (columnId) => {
  const respone = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/columns/${columnId}`
  );

  return respone.data;
};
/* Cards */
export const createNewCardAPI = async (newCardData) => {
  const respone = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/cards`,
    newCardData
  );

  return respone.data;
};
export const updateCardDetailsAPI = async (cardId, updateData) => {
  const respone = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/cards/${cardId}`,
    updateData
  );

  return respone.data;
};

/* Users */
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data
  );
  toast.success(
    "Account created successfully! Please check and verify your account before logging in!",
    { theme: "colored" }
  );
  return response.data;
};
export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data
  );
  toast.success(
    "Account verified successfully! Now you can login to enjoy our services! Have a good day!",
    { theme: "colored" }
  );
  return response.data;
};
export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/users/refresh_token`
  );
  return response.data;
};

export const inviteUserToBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/invitations/board`,
    data
  );
  toast.success("User invited to board successfully!");
  return response.data;
};
