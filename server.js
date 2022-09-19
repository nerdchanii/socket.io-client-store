import { createServer } from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 3000;

const httpServer = createServer();
const io = new Server(httpServer, {cors: {origin: '*'}});



io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
});

httpServer.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

