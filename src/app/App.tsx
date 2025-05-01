import "@/app/App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { StudentLayout } from "../pages/main-layout/StudentLayout";
import { AdminLayout } from "../pages/main-layout/AdminLayout"; // 新增
import LoginPage from "../pages/login-page/LoginPage";
import RegisterPage from "../pages/register-page/RegisterPage";
import HomePage from "../pages/student/home-page/HomePage";
import AdminHomePage from "../pages/admin/admin-home-page/AdminHomePage"; // 新增
import ProfilePage from "../pages/student/profile-page/ProfilePage";
import { useAuthStore } from "@/stores/AuthStore";
import { Role } from "@/lib/enum";
import PermissionDeniedPage from "@/pages/PermissionDeniedPage";
import NotFoundPage from "@/pages/NotFoundPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

/**
 * 檢查目前使用者是不是 instructor。
 * 如果不是，就導回 student 首頁或 instructor 的 /admin 頁面。
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, getRole } = useAuthStore();
console.log('now', isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  //Instructor 可以進入 /admin, Student 想進 /admin → 被導回首頁
  if (requiredRole && getRole() !== requiredRole) {
    // 顯示無權限頁面
    return <Navigate to="/permission-denied" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { getHomeRedirect } = useAuthStore();

  return (
    <div className="App">
      <Routes>
        {/* 公共頁面 (不需要權限也可進入的頁面) */}
        <Route path="/" element={<StudentLayout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 根據角色導向 */}
        <Route path="/" element={<Navigate to={getHomeRedirect()} />} />

        {/* 前台 */}
        <Route path="/" element={<StudentLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute requiredRole={Role.STUDENT}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 後台 */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole={Role.INSTRUCTOR}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHomePage />} />
        </Route>

        {/* ❗無權限頁面與 404 fallback */}
        <Route path="/permission-denied" element={<PermissionDeniedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
