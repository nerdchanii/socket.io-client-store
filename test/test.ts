import { equal } from "assert";
import { io } from "socket.io-client";
import { ISocketIoStore, SocketIoStore } from "../lib";

const socket = io("http://localhost:3000", {
  transports: ["polling"],
});

const store = new SocketIoStore(socket, [
  {
    key: "chat message",
    reducer: (state: any, data: any) => {
      return [...state, data];
    },
    state: [],
  }
], {
  onConnect: (socket) => {
    console.log("connected");
  },
  onDisconnect: (socket) => {
    console.log("disconnected");
  }
});


store.send('chat message', 'hello world');


















