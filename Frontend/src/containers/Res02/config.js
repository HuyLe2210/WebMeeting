import { io } from "socket.io-client";

const socket = io("http://localhost:5001"); // đảm bảo đúng port backend
export default socket;