import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import "leaflet/dist/leaflet.css";
import Home from "./pages/Home";
import Itinerary from "./pages/Itinerary";
import Calendar from "./pages/Calendar";
import Logistics from "./pages/Logistics";
import Interests from "./pages/Interests";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav style={{ padding: "1rem", background: "#333", color: "#fff", marginBottom: "2rem" }}>
          <h2>AI Itinerary Planner</h2>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/itinerary/:id" element={<Itinerary />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;