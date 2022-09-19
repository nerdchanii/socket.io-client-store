import { io } from "socket.io-client";
import { SocketIoStore } from "./SocketIoStore";


const socket = io("http://localhost:3000");

const store = new SocketIoStore(socket, [
  {
    key: "chat message",
    reducer: (state: any, data: any) => {
      return [data, ...state];
    },
    state: [0],
  }
], {
  onConnect: (socket) => {
    console.log("connected");
  }
  
});


console.log(store)

const sub = store.subscribe("chat message", (state) => {
  console.log("state changed", state);
});
store.send("chat message", 1);
store.send("chat message", 3);
console.log(store.getState("chat message"));

console.log(sub);

console.log(store.getState("chat message"));