const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const io = new Server({
  cors: true,
});
const app = express();

app.use(bodyParser.json());

const emailToSocketMapping = new Map();

// on mean listening
// emit means emit something

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    const { emailId, roomId } = data;
    console.log("User: " + emailId + " joined room: " + roomId);

    emailToSocketMapping.set(emailId, socket.id);

    socket.join(roomId);
    socket.emit("joined-room", { roomId });
    socket.broadcast.to(roomId).emit("user-joined", { emailId });

    socket.on("message", (message) => {
      const { msg } = message;
      socket.broadcast.to(roomId).emit("message", { msg, emailId });
    });
  });
});

app.listen(8000, () => console.log("App listening on port 8000"));
io.listen(8001);
