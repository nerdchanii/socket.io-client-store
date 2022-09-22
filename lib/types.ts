import { Socket } from "socket.io-client/build/esm/socket";

export interface SocketIoStoreOptions {
  onConnect?: (socket: Socket) => void;
  onDisconnect?: (socket: Socket) => void;
  onConnectError?: (error: any) => void;
}

export type Listener = (message: any) => void;

/**
 * Reducer for socket.io store
 * @param {any} state - state
 * @param {any} data - data
 * @returns {any} - new state
 */
interface Reducer {
  (prevState: any, data: any): any;
}

/**
 * MessageHandler 
 * It is define How to handle socket data with Key using reducer.
 * 
 * when you make a new SocketStore, you need to pass MessageHandler array.
 * 
 * @interface MessageHandler
 * @property {string} key - key for the reducer
 * @property {any} state - initial state for the reducer
 * @property {Reducer} reducer - reducer function
 * 
 */
export interface MessageHandler {
  key: string;
  reducer: Reducer;
  state: any;
}


export interface ISocketIoStore {
  [key: string]: {
    reducer: (state: any, data: any) => any;
    state: any;
  };
}
