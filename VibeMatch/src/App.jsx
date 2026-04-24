import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Callback from "./pages/Callback";
import Footer from "./components/Footer";
import PublicProfile from "./pages/PublicProfile";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/u/:shareId" element={<PublicProfile />} />
        <Route path="/:username" element={<PublicProfile />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
