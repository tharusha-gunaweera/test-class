import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoPlatform from "./App";
import StudentDashboard from "./Components/Students/StudentDashboard";
import StudentNav from "./Components/Students/Navbar";
import ChatBox from "./Components/Students/ChatBox";
import MyClasses from "./Components/Students/MyClasses";
import TeacherDashboard from "./Components/Teacher/TeachersDashboard";
import TeacherClasses from "./Components/Teacher/ClassManagement";
import TeacherNav from "./Components/Teacher/Navbar";
import McqSection from "./Components/Teacher/McqSection";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Test from "./Components/Students/test"
import TestTeacher from "./Components/Teacher/test"
// import TeacherDashboard from "./Components/Teacher/TeacherDashBoard";
// import TeacherChatBox from "./Components/Students/ChatBox";
// import TeacherMyClasses from "./Components/Students/MyClasses";
import TeachersTimeTable from "./Components/Students/scheduler";
import Login from './Components/Students/Auth/login';
import Signup from './Components/Students/Auth/Signup';
import LandingPage from './Components/LandingPage';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense("Ngo9BigBOggjHTQxAR8/V1NNaF5cXmpCe0x0R3xbf1x1ZFRMZF1bRHVPIiBoS35Rc0VnW3tec3BTQ2ZbWE10VEBU");

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
            <Route path="/test" element={<Test />} />
            <Route path="/TestTeacher" element={<TestTeacher />} />

            <Route path="/VideoPlatform" element={<VideoPlatform />} />

            <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
            <Route path="/TeacherClasses" element={<TeacherClasses />} />
            <Route path="/MyClasses" element={<MyClasses />} />
            <Route path="/TeacherTimeTable" element={<TeachersTimeTable />} />

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
