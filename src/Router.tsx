import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminCourses from "./components/AdminComponents/Courses/AdminCourses";
import AdminLecturers from "./components/AdminComponents/Lecturers/AdminLecturers";
import AdminStudents from "./components/AdminComponents/Students/AdminStudents";
import ForgotPassword from "./components/ForgotPassword";
import LecturerCourses from "./components/LecturerComponents/Courses/LecturerCourses";
import LecturerCourseView from "./components/LecturerComponents/Courses/LecturerCourseView";
import Login from "./components/Login";
import UserProfile from "./components/UserComponents/UserProfile";
import AuthGuard from "./utils/AuthGuard";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <AuthGuard>
        <Routes>
          <Route path="/admin-lecturers" element={<AdminLecturers />} />
          <Route path="/admin-students" element={<AdminStudents />} />
          <Route path="/admin-courses" element={<AdminCourses />} />
          <Route path="/change-password" element={<UserProfile />} />

          <Route path="/lecturer-courses" element={<LecturerCourses />} />
          <Route
            path="/lecturer-courses/:courseId"
            element={<LecturerCourseView />}
          />
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  );
}

export default Router;
