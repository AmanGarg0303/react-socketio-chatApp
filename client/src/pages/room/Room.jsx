import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../providers/socket";
import "./room.css";

const msgWithUserId = [];

export default function Room() {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const scrollRef = useRef();

  const usersInRoom = useCallback(
    ({ emailId }) => {
      setUsers([...users, emailId]);
    },
    [users]
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    const msg = e.target[0].value;
    socket.emit("message", { msg });
    setMessages([...messages, msg]);
    msgWithUserId.push({ emailId: "You", msg });
    e.target[0].value = "";
  };

  const handleAllMessages = useCallback(
    ({ msg, emailId }) => {
      setMessages([...messages, msg]);
      msgWithUserId.push({ emailId: emailId, msg });
    },
    [messages]
  );

  useEffect(() => {
    socket.on("user-joined", usersInRoom);
    socket.on("message", handleAllMessages);
    scrollRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    return () => {
      socket.off("user-joined", usersInRoom);
      socket.off("message", handleAllMessages);
    };
  }, [handleAllMessages, socket, usersInRoom]);

  //   console.log(users);
  //   console.log(messages);
  console.log(msgWithUserId);

  return (
    <div className="room-container">
      <h1>Room with id {roomId} </h1>
      {users.map((user, _) => (
        <ul key={_}>
          <li>{user} joined the chat</li>
        </ul>
      ))}

      <div className="msg-container">
        {msgWithUserId.length > 0 &&
          msgWithUserId.map((data, _) => (
            <p
              key={_}
              className={`${data.emailId === "You" ? "my-msg" : "your-msg"}`}
            >
              <strong>{data.emailId}</strong>: {data.msg}
            </p>
          ))}
      </div>

      <form className="form-group" onSubmit={handleSendMessage}>
        <input type="text" placeholder="Enter your message" />
        <button type="submit" className="btn">
          Send
        </button>
      </form>

      <div ref={scrollRef}></div>
    </div>
  );
}
