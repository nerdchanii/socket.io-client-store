import { io } from "socket.io-client";
import {
  Socket,
  SocketOptions,
} from "../node_modules/socket.io-client/build/esm/socket";

// interface ISocketIoStore {
//   onConnect: (socket: Socket) => void;
//   onDisconnect: (socket: Socket) => void;
//   onMessage: (socket: Socket, message: any) => void;
//   send(): void;
// }

interface ISocketIoStoreOptions {
  onConnect?: (socket: Socket) => void;
  onDisconnect?: (socket: Socket) => void;
}

export type Listener = (message: any) => void;

interface SocketReducer {
  key: string;
  reducer: (state: any, data: any) => any;
  state: any;
}

interface IStoreReducer {
  [key: string]: {
    state: any;
    reducer: (state: any, data: any) => any;
  };
}

export class SocketIoStore {
  listeners!: {
    [key: string]: Listener[] | undefined;
  };
  reducer!: IStoreReducer;

  constructor(
    protected socketIO: Socket,
    socketReducer: Array<SocketReducer>,
    protected options: ISocketIoStoreOptions
  ) {
    this.reducer = socketReducer.reduce((acc, curr) => {
      const temp = {
        state: curr.state,
        reducer: curr.reducer,
      };
      if (acc[curr.key] !== undefined) {
        throw new Error(
          `Key ${curr.key} already exists, please use a Unique key`
        );
      }
      acc[curr.key] = temp;
      return acc;
    }, {} as IStoreReducer);

    this.socketIO.open();
    this.socketIO.on("connect", () => {
      this.options.onConnect?.(this.socketIO);
      socketReducer.map(({ key, reducer }) => {
        this.socketIO.on(key, (data: any) => {
          this.reducer[key].state = reducer(this.reducer[key].state, data);
        });
      });
    });
  }

  send(key: string, data: any) {
    this.socketIO.emit(key, data);
  }

  makeSender(key: string) {
    return (data: any) => this.send(key, data);
  }

  getState = (key: string) => {
    return this.reducer[key];
  };

  subscribe = (key: string, listener: (state: any) => void) => {
    if (this.listeners === undefined) {
      this.listeners = {};
    }
    if (this.listeners[key] === undefined) {
      this.listeners[key] = [listener];
    } else {
      console.log(this.listeners[key]);
      this.listeners[key] = [...this.listeners[key]!, listener];
    }
    return () => {
      this.listeners[key] = this.listeners[key]!.filter(
        (l) => l !== listener
      );
    }
  };

  notify = (key: string) => {
    this.listeners[key]?.map((listener) => listener(this.reducer[key].state));
    console.log(this.reducer[key].state, key);
  };
}
