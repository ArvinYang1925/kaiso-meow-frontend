import "@/App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { ClientLayout } from "./pages/main-layout/ClientLayout";
import { AdminLayout } from "./pages/main-layout/AdminLayout"; // 新增
import LoginPage from "./pages/login-page/LoginPage";
import RegisterPage from "./pages/register-page/RegisterPage";
import HomePage from "./pages/client/home-page/HomePage";
import AdminHomePage from "./pages/admin/admin-home-page/AdminHomePage"; // 新增
import ProfilePage from "./pages/client/profile-page/ProfilePage";

function App() {
  const role = localStorage.getItem("role");

  return (
    <div className="App">
      <Routes>
        {/* 公共頁面 (不需要權限也可進入的頁面) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 根據角色導向 */}
        <Route
          path="/"
          element={
            role === "student" ? (
              <Navigate to="/client" />
            ) : role === "instructor" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 前台 student 專屬 */}
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<HomePage />} /> {/* /home */}
          <Route path="profile" element={<ProfilePage />} /> {/* /home/profile */}
        </Route>

        {/* 後台 instructor 專屬 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
