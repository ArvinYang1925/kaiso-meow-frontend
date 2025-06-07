import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, User, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import { useCourseStore } from "./courseManagementStore";
import { useImageWithFallback } from "@/components/utils/courseImageUtils";
import Education from "@/assets/education.jpg";
import { CourseListItemModel } from "./courseManagement.model";

// 課程卡片組件類型定義
interface CourseCardProps {
  course: CourseListItemModel;
  index: number;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, index, onClick }) => {
  const [imageSrc, handleImageError] = useImageWithFallback(course.coverUrl);

  // 格式化日期
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("zh-TW");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card
        className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
          !course.isPublished ? "opacity-90" : ""
        }`}
      >
        <CardHeader className="p-0 relative">
          <div className="relative">
            <motion.div
              whileHover={{ scale: course.isPublished ? 1.05 : 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={imageSrc}
                alt={course.title}
                className={`w-full h-48 object-cover transition-all duration-300 ${
                  !course.isPublished ? "filter grayscale-50" : ""
                }`}
                onError={handleImageError}
              />
            </motion.div>

            {/* 課程下架遮罩 */}
            {!course.isPublished && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="text-center text-white">
                  <EyeOff className="w-8 h-8 mx-auto mb-2 opacity-90" />
                  <span className="text-3xl font-bold">課程已下架</span>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <CardTitle
              className={`text-lg line-clamp-2 ${
                !course.isPublished ? "text-gray-600" : ""
              }`}
            >
              {course.title}
            </CardTitle>
            {course.isFree && (
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded flex-shrink-0 ml-2">
                免費
              </span>
            )}
          </div>

          <div className="space-y-2">
            {/* 講師資訊 */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                講師：{course.instructorName || "未提供"}
              </span>
            </div>

            {/* 學生數量 */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {course.studentCount} 位學生
              </span>
            </div>

            {/* 建立日期 */}
            <div className="text-xs text-gray-500 mt-3">
              建立於 {formatDate(course.createdAt)}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function CourseManagementListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setBreadcrumbs } = useBreadcrumbStore();

  // 使用課程 store
  const { courses, pagination, isLoading, fetchCourses } = useCourseStore();

  useEffect(() => {
    // 設置麵包屑
    setBreadcrumbs(location.pathname, {});

    // 載入課程列表
    fetchCourses({ page: 1, pageSize: 9 });
  }, [setBreadcrumbs, location.pathname, fetchCourses]);

  // 載入狀態的骨架畫面
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="p-0">
            <Skeleton className="w-full h-48" />
          </CardHeader>
          <CardContent className="p-4">
            <Skeleton className="h-6 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // 空狀態組件
  const EmptyState = () => (
    <div className="flex items-center justify-between p-12 bg-white rounded-lg shadow-sm">
      <div className="w-1/2 pr-8">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={Education}
            alt="建立新課程"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="w-1/2 pl-8 border-l">
        <h2 className="text-2xl font-semibold mb-4">建立新課程</h2>
        <p className="text-gray-500 text-md mb-8">
          建立一個新課程來轉換您的知識和經驗成為收入
        </p>
        <Button
          onClick={() => navigate(ADMIN_ROUTES.CREATE_COURSE)}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          建立課程
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">課程管理</h1>
          {!isLoading && courses.length > 0 && (
            <p className="text-gray-500 mt-1">
              共 {pagination.totalItems} 個課程
            </p>
          )}
        </div>
        {!isLoading && courses.length > 0 && (
          <Button
            onClick={() => navigate(ADMIN_ROUTES.CREATE_COURSE)}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            建立課程
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : courses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              onClick={() =>
                navigate(
                  `${ADMIN_ROUTES.COURSE_INFO.replace(":courseId", course.id)}`
                )
              }
            />
          ))}
        </div>
      )}

      {/* 分頁控制 */}
      {!isLoading && courses.length > 0 && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <span className="text-sm text-muted-foreground">
            第 {pagination.currentPage} 頁，共 {pagination.totalPages} 頁
          </span>
          <div className="space-x-2 flex items-center">
            <Button
              variant="outline"
              size="sm"
              className={
                pagination.currentPage <= 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-200"
              }
              onClick={() => {
                fetchCourses({
                  page: pagination.currentPage - 1,
                  pageSize: 9,
                });
              }}
              disabled={pagination.currentPage <= 1}
            >
              上一頁
            </Button>

            {Array.from({ length: pagination.totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <Button
                  key={page}
                  variant={
                    page === pagination.currentPage ? "outline" : "ghost"
                  }
                  size="sm"
                  className={
                    page === pagination.currentPage
                      ? "text-gray-600 hover:bg-gray-100 hover:text-gray-500 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-300 hover:text-gray-700"
                  }
                  onClick={() => {
                    fetchCourses({
                      page,
                      pageSize: 9,
                    });
                  }}
                  disabled={page === pagination.currentPage}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchCourses({
                  page: pagination.currentPage + 1,
                  pageSize: 9,
                });
              }}
              disabled={pagination.currentPage >= pagination.totalPages}
              className={
                pagination.currentPage >= pagination.totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-200"
              }
            >
              下一頁
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
