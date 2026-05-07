import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import NoteDetail from "./pages/NoteDetail";
import Perfumes from "./pages/Perfumes";
import PerfumeDetail from "./pages/PerfumeDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:id" element={<NoteDetail />} />

        <Route path="/perfumes" element={<Perfumes />} />
        <Route path="/perfumes/:id" element={<PerfumeDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </ThemeProvider>
  );
}
