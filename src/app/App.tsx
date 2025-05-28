import { Route, Routes, Navigate } from "react-router-dom";
import { CLIENT_ROUTES, ADMIN_ROUTES, PUBLIC_ROUTES } from "./route-path";
import { useAuthStore } from "@/stores/authStore";
import { Role } from "@/lib/enum";
/** 前台頁面模板 */
import { StudentLayout } from "../pages/main-layout/StudentLayout";
/** 後台頁面模板 */
import { AdminLayout } from "../pages/main-layout/AdminLayout";
/** 註冊登入頁面 */
import AuthPage from "@/pages/auth-page/AuthPage";
/** 無使用權限頁面 */
import PermissionDeniedPage from "@/pages/PermissionDeniedPage";
/** 404 找不到路由頁面 */
import NotFoundPage from "@/pages/NotFoundPage";
/** 後台 404 頁面 */
import AdminNotFound from "@/pages/admin/not-found-page/NotFound";
/** 前台首頁 */
import HomePage from "../pages/student/home-page/HomePage";
/** 後台頁面 */
import AdminHomePage from "../pages/admin/admin-home-page/AdminHomePage";
/** 前台個人資料頁面 */
import ProfilePage from "../pages/student/profile-page/ProfilePage";
/** 後台講師個人設定頁面 */
import InstructorInfoPage from "@/pages/admin/instructor-info-page/InstructorInfoPage";
/** 後台變更密碼頁面 */
import PasswordPage from "@/pages/admin/instructor-info-page/PasswordPage";
/** 前台變更密碼頁面 */
import ResetPasswordPage from "@/pages/reset-password-page/ResetPasswordPage";
/** 前台查看訂單頁面 */
import OrderListPage from "@/pages/student/order-list-page/OrderListPage";
/** 後台學生列表頁面 */
import StudentListPage from "@/pages/admin/student-list-page/StudentListPage";
/** 後台訂單管理頁面 */
import InstructorOrderListPage from "@/pages/admin/instructor-order-page/InstructorOrderListPage";
/** 後台折扣碼列表頁面 */
import CouponListPage from "@/pages/admin/coupon-list-page/CouponListPage";
/** 前台課程詳細頁面 */
import CourseDetailPage from "@/pages/student/course-detail-page/CourseDetailPage";
/** 前台訂單詳細頁面 */
import OrderPage from "@/pages/student/order-page/OrderPage";
/** 後台課程管理頁面 */
import InstructorCoursePage from "@/pages/admin/instructor-course-page/instructorCoursePage";
import InstructorCourseCreatePage from "@/pages/admin/instructor-course-page/instructorCourseCreatePage";
import InstructorCourseDetailPage from "@/pages/admin/instructor-course-page/instructorCourseDetailPage";
import InstructorCourseChaptersPage from "@/pages/admin/instructor-course-page/instructorCourseChaptersPage";
import InstructorCourseDeactivatePage from "@/pages/admin/instructor-course-page/instructorCourseDeactivatePage";

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

  //Instructor 可以進入 /admin, Student 想進 /admin → 被導到查無權限頁面
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
        <Route path={PUBLIC_ROUTES.AUTH} element={<AuthPage />} />
        <Route
          path={PUBLIC_ROUTES.RESET_PASSWORD}
          element={<ResetPasswordPage />}
        />

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
          <Route
            path={CLIENT_ROUTES.ORDER_LIST}
            element={
              <ProtectedRoute requiredRole={Role.STUDENT}>
                <OrderListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={CLIENT_ROUTES.COURSE}
            element={
              <ProtectedRoute requiredRole={Role.STUDENT}>
                <CourseDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={CLIENT_ROUTES.ORDER}
            element={
              <ProtectedRoute requiredRole={Role.STUDENT}>
                <OrderPage />
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
          <Route path={ADMIN_ROUTES.ME} element={<InstructorInfoPage />} />
          <Route
            path={ADMIN_ROUTES.CHANGE_PASSWORD}
            element={<PasswordPage />}
          />
          <Route path={ADMIN_ROUTES.STUDENTS} element={<StudentListPage />} />
          <Route
            path={ADMIN_ROUTES.INSTRUCTOR_ORDERS}
            element={<InstructorOrderListPage />}
          />
          <Route path={ADMIN_ROUTES.COUPONS} element={<CouponListPage />} />
          {/* 課程相關路由 */}
          <Route
            path={ADMIN_ROUTES.COURSES}
            element={<InstructorCoursePage />}
          />
          <Route
            path={ADMIN_ROUTES.CREATE_COURSE}
            element={<InstructorCourseCreatePage />}
          />
          <Route
            path={ADMIN_ROUTES.COURSE_INFO}
            element={<InstructorCourseDetailPage />}
          />
          <Route
            path={ADMIN_ROUTES.CHAPTER_MANAGEMENT}
            element={<InstructorCourseChaptersPage />}
          />
          <Route
            path={ADMIN_ROUTES.DEACTIVATE_COURSE}
            element={<InstructorCourseDeactivatePage />}
          />
          {/* 後台 404 頁面 */}
          <Route path="*" element={<AdminNotFound />} />
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
