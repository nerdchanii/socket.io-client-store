import {  Socket } from "socket.io-client";
import { Listener, ISocketIoStore, MessageHandler, SocketIoStoreOptions } from "./types";

export class SocketIoStore {
  private listeners!: {
    [key: string]: Listener[] | undefined;
  };
  private store!: ISocketIoStore;

  /**
   * 
   * @param {Socket} socketIO - socket.io client instance
   * @param {MessageHandler[]} messageHandlers - socket reducers.
   * @param {SocketIoStoreOptions} options - options for socket.io store
   */
  constructor(
    protected socketIO: Socket,
    messageHandlers: MessageHandler[],
    protected options: SocketIoStoreOptions = {} 
  ) {
    this.listeners = {};
    this.store = messageHandlers.reduce((acc, curr) => {
      const { state, reducer, key } = curr;
      const temp = { state, reducer };
      if (acc[key] !== undefined)
        throw new Error(`Key ${key} already exists, please use a Unique key`);
      acc[key] = temp;
      return acc;
    }, {} as ISocketIoStore);

    /** Listen to socket.io events */
    this.socketIO.on("connect", () => {
      this.options.onConnect?.(this.socketIO);
      messageHandlers.map(({ key, reducer }) => {
        this.socketIO.on(key, (data: any) => {
          this.store[key].state = reducer(this.store[key].state, data);
          this.notify(key, this.store[key].state);
        });
      });
    });
    this.socketIO.on("disconnect", ()=>{
      this.options.onDisconnect?.(this.socketIO);
    });
    this.socketIO.on("connect_error", (error: any) => {
      this.options.onConnectError?.(error);
    });
  }

  /**
   * Send data to the server using socket.io
   * @param {string} key - key of the state
   * @param {any} data - data to send
   * @returns socket.io client instance
   * @example
   * store.send('chat message', 'hello world'); 
   * 
   */
  public send(key: string, data: any) {
    return this.socketIO.emit(key, data);
  }
  /**
   * Create a send function for key
   * @method createSender
   * @param key 
   * @returns 
   */
  public createSender(key: string) {
    return (data: any) => this.send(key, data);
  }

  /**
   * Get the socket.io client instace
   * @returns {Socket} socket.io client instance
   */
  public getSocket(): Socket {
    return this.socketIO;
  };

  /**
   * Get the state of the key
   * @param {string} key - key of the state
   * @returns {any} - state
   * 
   */
  public getState(key: string): any {
    return this.store[key].state;
  };

  /**
   * 
   * @param {string} key - key of the state
   * @param {Listener} listener - callback function
   * @returns unsubscribe function
   */
  public subscribe = (key: string, listener: Listener) => {
    if (this.listeners[key] === undefined) {
      this.listeners[key] = [listener];
    } else {
      this.listeners[key] = [...this.listeners[key]!, listener];
    }
    
    return () => {
      if (this.listeners[key]?.length === 1) this.listeners[key] = [];
      else this.listeners[key] = this.listeners[key]!.filter((l) => l !== listener );};
  };

  /**
   * Notify to listeners of the key
   * @param {string} key - key of the state
   * @param {any} state - new state
   */
  private notify = (key: string, state: any) => {
    this.listeners[key]?.map((listener) => listener(state));
  };
}
