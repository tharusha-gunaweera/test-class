import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Students/Navbar";
import Dashboard from "./Students/Dashboard";
import ChatBox from "./Students/ChatBox";
import MyClasses from "./Students/MyClasses";




function App() {
  return (
    <Router>
      <div className="flex">
        <div className="flex-grow p-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ChatBox" element={<ChatBox />} />
            <Route path="/MyClasses" element={<MyClasses />} />
            
          </Routes>
        </div>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
