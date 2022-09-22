# socket.io-store

It is a store for socket.io.

## 1. Installation

```bash
# npm
# npm install socket-io-store

# yarn
# $ yarn add socket.io-store
```

## 2. Usage

### 2.1. Make Socket instance 

It is [`socket.io/client`](https://github.com/socketio/socket.io-client) instance.

```js
const socket = io('https://your.socket.io.server.com');
```

### 2.2. Make Store instance

`SocketIoStore` get three Arguments.
- `socket` : Socket instance
- `MessageHandler[]`: Reducer list for socket.io
  - it is Object that has `key`, `reducer`, `state`.
    - `key`: string
    - `reducer`: (state, newData) => state
    - `state`: any (initial state)
- `options` : storeOptions


```ts
const store = new SocketIoStore(socket: Socket, [{
  key: 'chat',
  reducer: ( prevState, newData ) => {
    // What you want to do with the prevState and newData
    return [newState, ...prevState];
    }
  state: []
  }]: MessageHandler[], 
  {
    onConnect: () => {
      // What you want to do when connected
    },
    onDisconnect: () => {
      // What you want to do when disconnected
    },
    onConnectError: () => {
      // What you want to do when connection error
    },
  } : {
    onConnect?: () => void,
    onDisconnect?: () => void,
    onConnectError?: () => void,
  });
);
```
### 2.3. How to use Store

#### 2.3.1. Get state

```ts
/** 
 * How to get a state of the key
 * @param {string} key - key of the state
 * @return {any} - state 
 */ 
const state = store.getState('chat'); // ex) ['hello', 'world', 'hello world']
```

#### 2.3.2. Subscribe and Unsubscribe


```ts
/**
 * How to get Socket instance 
 * @return {Socket} - socket.io instance */
const socket = store.getSocket(); // ex) 

/** 
 * How to Subscribe, Unsubscribe
 * @param {string} key - for you want to subscribe 
 * @param {Function} callbackFunction - that will be called when state is changed
 * @return {Function} - unsubscribe function that can use to remove subscription
 */ 
const unsubscribe = store.subscribe('chat', (state) => {
  // What you want to do with the state
});

/** unsubscribe */
unsubscribe();
```

#### 2.3.3. How to emit event to server 
```ts
/**
 * How to send message to server
 * @param {string} key - event name
 * @param {any} data - data that you want to send
 */
store.send('chat', 'Hello World');

/**
 * How to create send function with key
 * @param {string} key - event name
 * @return {Function} send function that can use to send message
 */
const send = store.createSender('chat');
send('Hello World'); // same as store.send('chat', 'Hello World');
```

## License

[MIT](./LICENSE)


## Contributing

Contributions, issues and feature requests are welcome!





