import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home/Home";
import Reports from "../../pages/Reports/Reports";
import Ai from "../../pages/Ai/Ai";
import About from "../../pages/About/About";
import NotFound from "../../pages/NotFound/NotFound";
import "./Main.css";

function Main() {
    return (
        <main className="main">
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/ai" element={<Ai />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
    );
}

export default Main;
