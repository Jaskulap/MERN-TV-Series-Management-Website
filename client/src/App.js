import { Route, Routes, Navigate } from "react-router-dom"
import Main from "./components/Main"
import Signup from "./components/Signup"
import Login from "./components/Login"
import Serial from "./components/Serial"
import Profile from "./components/Profile"
import Statistics from "./components/Statistics"
import Community from "./components/Community"
import "./fonts/FranklinGothic.ttf";
function App() {
  const user = localStorage.getItem("token")
  return (
    <Routes>
      {user && <Route path="/" exact element={<Main />} />}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      {user && <Route path="/profile" exact element={<Profile />} />}
      {user && <Route path="/serial/:title" exact element={<Serial />} />}
      {user && <Route path="/statistics" exact element={<Statistics />} />}
      {user && <Route path="/community" exact element={<Community />} />}
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/profile" element={<Navigate replace to="/login" />} />
      <Route path="/serial" element={<Navigate replace to="/login" />} />
      <Route path="/statistics" element={<Navigate replace to="/login" />} />
      <Route path="/community" element={<Navigate replace to="/login" />} />
    </Routes>
  )
}
export default App