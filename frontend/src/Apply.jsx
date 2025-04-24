import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Students/Navbar";
import StudentDashboard from "./Components/Students/StudentDashboard";
import StudentNav from "./Components/Students/Navbar";
import ChatBox from "./Components/Students/ChatBox";
import MyClasses from "./Components/Students/MyClasses";
import TeacherDashboard from "./Components/Teacher/TeachersDashboard";
import TeacherClasses from "./Components/Teacher/ClassManagement";
import TeacherNav from "./Components/Teacher/Navbar";
import McqSection from "./Components/Teacher/McqSection";
import AdminDashboard from "./Components/Admin/AdminDashboard";
// import TeacherDashboard from "./Components/Teacher/TeacherDashBoard";
// import TeacherChatBox from "./Components/Students/ChatBox";
// import TeacherMyClasses from "./Components/Students/MyClasses";
import Login from './Components/Students/Auth/login';
import Signup from './Components/Students/Auth/Signup';
import LandingPage from './Components/LandingPage';



function App() {
  return (
    <Router>
      <div className="flex">
        <div className="flex-grow">
          <Routes>

          <Route path="/" element={<LandingPage />} />

            <Route path="/Login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/Dashboard" element={<StudentDashboard />} />
            <Route path="/ChatBox" element={<ChatBox />} />
            <Route path="/MyClasses" element={<MyClasses />} />

            <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
            <Route path="/TeacherClasses" element={<TeacherClasses />} />
            <Route path="/MyClasses" element={<MyClasses />} />
            <Route path="/McqSection" element={<McqSection />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="/admin/classes" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
          </Routes>
        </div>
        {/* <Navbar /> */}
      </div>
    </Router>
  );
}

export default App;
