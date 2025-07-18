import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoPlatform from "./App";
import StudentDashboard from "./Components/Students/StudentDashboard";
import Payment from "./Components/Students/payment";
import MetirialUpload from "./Components/Students/MetirialUpload";
import MetirialManage from "./Components/Teacher/Managematerials";
import MyClasses from "./Components/Students/MyClasses";
import TeacherDashboard from "./Components/Teacher/TeachersDashboard";
import TeacherClasses from "./Components/Teacher/ClassManagement";
import TeacherNav from "./Components/Teacher/Navbar";
import McqSection from "./Components/Teacher/McqSection";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminManageUsers from "./Components/Admin/AdminStudentPanel";
import AdminTeacherPanel from "./Components/Admin/AdminTeacherPanel";
import AdminProfile from "./Components/Admin/AdminProfile";
import AdminProgressCheck from "./Components/Teacher/AdminProgressCheck";
import Test from "./Components/Students/test"
import TestTeacher from "./Components/Teacher/UpcommingClasses"
import TeachersTimeTable from "./Components/Students/scheduler";
import Login from './Components/Students/Auth/login';
import Signup from './Components/Students/Auth/Signup';
import LandingPage from './Components/LandingPage';
import StudentProfile from './Components/Students/studentProfile';
import TeacherProfile from "./Components/Teacher/teacherProfile";
import { registerLicense } from '@syncfusion/ej2-base';
import SalaryForm from "./Components/Admin/SalaryForm";
import SalaryRecords from "./Components/Admin/SalaryRecords";
import Payments from './Components/Admin/Payments';

registerLicense("Ngo9BigBOggjHTQxAR8/V1JEaF5cXmRCdkxzWmFZfVtgdVdMZFhbRnNPMyBoS35Rc0VkWXdecHBQRmBaVUR2VEFd");

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
            <Route path="/studentProfile" element={<StudentProfile />} />
            
            <Route path="/MyClasses" element={<MyClasses />} />
            <Route path="/MetirialUpload" element={<MetirialUpload />} />
            <Route path="/Payment" element={<Payment />} />
            
            
            <Route path="/test" element={<Test />} />
            <Route path="/TestTeacher" element={<TestTeacher />} />

            <Route path="/VideoPlatform" element={<VideoPlatform />} />

            <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
            <Route path="/teacherProfile" element={<TeacherProfile />} />
            <Route path="/TeacherClasses" element={<TeacherClasses />} />
            <Route path="/MyClasses" element={<MyClasses />} />
            <Route path="/TeacherTimeTable" element={<TeachersTimeTable />} />
            <Route path="/MetirialManage" element={<MetirialManage />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/AdminProfile" element={<AdminProfile />} />
            <Route path="/AdminProgressCheck" element={<AdminProgressCheck />} />
            <Route path="/admin/classes" element={<AdminDashboard />} />
            <Route path="/SalaryForm" element={<SalaryForm />} />
            <Route path="/salary-records" element={<SalaryRecords />} />
            <Route path="/Payments" element={<Payments />} />
            <Route path="/Payments/AdminProgressCheck" element={<AdminProgressCheck />} />
            <Route path="/AdminManageUsers" element={<AdminManageUsers />} />
            <Route path="/AdminTeacherPanel" element={<AdminTeacherPanel />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
          </Routes>
        </div>
        {/* <Navbar /> */}
      </div>
    </Router>
  );
}

export default App;
