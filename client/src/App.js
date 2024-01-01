import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Room from "./pages/room/Room";
import { SocketProvider } from "./providers/socket";

function App() {
  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}

export default App;
