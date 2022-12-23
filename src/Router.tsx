import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLecturers from "./components/AdminComponents/AdminLecturers";
import ForgotPassword from "./components/ForgotPassword";
import Login from "./components/Login";
import UserProfile from "./components/UserComponents/UserProfile/UserProfile";
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
        <Route path ="change-password" element ={<UserProfile />}/>
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  );
}

export default Router;
