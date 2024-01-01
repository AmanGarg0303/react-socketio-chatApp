import React, { useCallback, useEffect } from "react";
import "./home.css";
import { useSocket } from "../../providers/socket";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const handleRoomJoined = useCallback(
    ({ roomId }) => {
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);

    return () => {
      socket.off("joined-room", handleRoomJoined);
    };
  }, [socket, handleRoomJoined]);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    let emailId = e.target[0].value;
    let roomId = e.target[1].value;

    socket.emit("join-room", { emailId, roomId });
  };

  return (
    <div className="container">
      <form className="form-group" onSubmit={handleJoinRoom}>
        <input type="text" placeholder="Email" required autoComplete="off" />
        <input type="text" placeholder="Room ID" required autoComplete="off" />
        <button className="btn" type="submit">
          Enter Room
        </button>
      </form>
    </div>
  );
}
