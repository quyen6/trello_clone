// Cấu hình Socket io phía client
import { io } from "socket.io-client";
import { API_ROOT } from "./utils/constants.js";
export const socketIoInstane = io(API_ROOT);
