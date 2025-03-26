import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Debate from "./components/Debate";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/debate" element={<Debate />} />
            </Routes>
        </Router>
    );
}

export default App;
