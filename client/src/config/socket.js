import io from "socket.io-client";
import keys from "./keys";

export const socket = io(keys.ENDPOINT);