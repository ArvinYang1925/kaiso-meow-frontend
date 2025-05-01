import "@/app/App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { CLIENT_ROUTES, ADMIN_ROUTES, PUBLIC_ROUTES } from "./route-path";
import { useAuthStore } from "@/stores/AuthStore";
import { Role } from "@/lib/enum";
/** 前台頁面模板 */
import { StudentLayout } from "../pages/main-layout/StudentLayout";
/** 後台頁面模板 */
import { AdminLayout } from "../pages/main-layout/AdminLayout";
/** 登入頁面 */
import LoginPage from "../pages/login-page/LoginPage";
/** 註冊頁面 */
import RegisterPage from "../pages/register-page/RegisterPage";
/** 無使用權限頁面 */
import PermissionDeniedPage from "@/pages/PermissionDeniedPage";
/** 404 找不到路由頁面 */
import NotFoundPage from "@/pages/NotFoundPage";
/** 前台首頁 */
import HomePage from "../pages/student/home-page/HomePage";
/** 後台頁面 */
import AdminHomePage from "../pages/admin/admin-home-page/AdminHomePage";
/** 前台個人資料頁面 */
import ProfilePage from "../pages/student/profile-page/ProfilePage";
import AuthPage from "@/pages/auth-page/AuthPage";

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
  if (!isAuthenticated) {
    return <Navigate to={CLIENT_ROUTES.HOME} />;
  }

  //Instructor 可以進入 /admin, Student 想進 /admin → 被導回首頁
  if (requiredRole && getRole() !== requiredRole) {
    // 顯示無權限頁面
    return <Navigate to={PUBLIC_ROUTES.PERMISSION_DENIED} replace />;
  }

  return <>{children}</>;
};

function App() {
  const { getHomeRedirect } = useAuthStore();

  return (
    <div className="App">
      <Routes>
        {/* 公共頁面 (不需要權限也可進入的頁面) */}
        <Route path={CLIENT_ROUTES.HOME} element={<StudentLayout />} />
        <Route path={PUBLIC_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={PUBLIC_ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={PUBLIC_ROUTES.AUTH} element={<AuthPage />} />
        {/* AuthPage */}

        {/* 根據角色導向 */}
        <Route
          path={CLIENT_ROUTES.HOME}
          element={<Navigate to={getHomeRedirect()} />}
        />

        {/* 前台 */}
        <Route path={CLIENT_ROUTES.HOME} element={<StudentLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path={CLIENT_ROUTES.PROFILE}
            element={
              <ProtectedRoute requiredRole={Role.STUDENT}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 後台 */}
        <Route
          path={ADMIN_ROUTES.HOME}
          element={
            <ProtectedRoute requiredRole={Role.INSTRUCTOR}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHomePage />} />
        </Route>

        {/* ❗無權限頁面與 404 fallback */}
        <Route
          path={PUBLIC_ROUTES.PERMISSION_DENIED}
          element={<PermissionDeniedPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
