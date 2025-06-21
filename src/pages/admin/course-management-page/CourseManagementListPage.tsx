import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, User, EyeOff, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import { useCourseStore } from "./courseManagementStore";
import { useImageWithFallback } from "@/components/utils/courseImageUtils";
import { useScreenLoading } from "@/components/common/useScreenLoading";
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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer h-full"
      onClick={onClick}
    >
      <Card
        className={`overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col ${
          !course.isPublished ? "opacity-90" : ""
        }`}
        style={{ minHeight: "400px" }}
      >
        <CardHeader className="p-0 relative flex-shrink-0">
          <div className="relative overflow-hidden">
            <motion.div
              whileHover={{
                scale: course.isPublished ? 1.08 : 1.03,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              className="overflow-hidden"
            >
              <img
                src={imageSrc}
                alt={course.title}
                className={`w-full h-full object-cover object-center transition-all duration-500 ${
                  !course.isPublished ? "filter grayscale-50 brightness-75" : ""
                }`}
                style={{ height: "270px" }} // 調整為 270px，與文字區 180px 形成 3:2 比例
                onError={handleImageError}
              />
            </motion.div>

            {/* 課程下架遮罩 */}
            {!course.isPublished && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/70 flex items-center justify-center backdrop-blur-[1px]"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-center text-white"
                >
                  <motion.div
                    animate={{
                      rotateY: [0, 10, -10, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    <EyeOff className="w-8 h-8 mx-auto mb-2 opacity-90 drop-shadow-lg" />
                  </motion.div>
                  <span className="text-lg font-bold drop-shadow-lg tracking-wide">
                    課程已下架
                  </span>
                </motion.div>
              </motion.div>
            )}

            {/* 懸停時的額外效果 */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 pointer-events-none"
              whileHover={{ opacity: course.isPublished ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <CardTitle
              className={`text-base leading-5 line-clamp-2 font-semibold flex-1 ${
                !course.isPublished ? "text-gray-600" : "text-gray-900"
              }`}
            >
              {course.title}
            </CardTitle>
            {course.isFree && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full flex-shrink-0 ml-2 shadow-sm"
              >
                免費
              </motion.span>
            )}
          </div>

          <div className="space-y-2">
            {/* 講師資訊 */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              <span className="text-xs text-gray-600 truncate">
                講師：{course.instructorName || "未提供"}
              </span>
            </motion.div>

            {/* 學生數量 */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="flex items-center gap-2"
            >
              <Users className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              <span className="text-xs text-gray-600">
                {course.studentCount} 位學生
              </span>
            </motion.div>

            {/* 建立日期 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="text-xs text-gray-500"
            >
              建立於 {formatDate(course.createdAt)}
            </motion.div>
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

  // 全螢幕 Loading
  const { ScreenLoading, withLoading } = useScreenLoading();

  // 使用課程 store
  const { courses, pagination, filter, fetchCourses, resetCourses, setFilter } =
    useCourseStore();

  const [isPageInitialized, setIsPageInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // 搜尋處理函數
  const handleSearch = async (query: string) => {
    try {
      // 使用 setFilter 來處理搜尋，這會觸發重新獲取資料
      setFilter({ search: query.trim() });
    } catch {
      // 靜默處理錯誤
    }
  };

  // 處理搜尋輸入變化 - 防抖處理
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);

    // 清除之前的定時器
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // 設置新的定時器，500ms 後執行搜尋
    const newTimeout = setTimeout(() => {
      handleSearch(value);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  // 初始化時同步搜尋狀態
  useEffect(() => {
    setSearchQuery(filter.search || "");
  }, [filter.search]);

  // 清理定時器
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  useEffect(() => {
    // 設置麵包屑
    setBreadcrumbs(location.pathname, {});

    // 頁面初始載入 - 先清空舊資料，再使用全域 LOADING
    const initializeCoursePage = async () => {
      // 立即清空舊的課程資料，防止舊資料閃現
      if (resetCourses) {
        resetCourses();
      }

      // 重置搜尋狀態
      setFilter({ search: "" });
      setSearchQuery("");

      setIsPageInitialized(false);

      try {
        await withLoading(
          () => fetchCourses({ page: 1, pageSize: 9 }),
          "正在載入課程列表..."
        );
      } finally {
        setIsPageInitialized(true);
      }
    };

    initializeCoursePage();
  }, [
    setBreadcrumbs,
    location.pathname,
    fetchCourses,
    withLoading,
    resetCourses,
    setFilter,
  ]);

  // 分頁處理 - 使用全域 LOADING
  const handlePageChange = async (page: number) => {
    try {
      await withLoading(
        () => fetchCourses({ page, pageSize: 9 }),
        "正在載入課程列表..."
      );
    } catch {
      // 靜默處理錯誤
    }
  };

  // 空狀態組件 - 真的沒有課程時顯示
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-between p-12 bg-white rounded-lg shadow-sm"
    >
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
    </motion.div>
  );

  // 搜尋無結果狀態組件
  const NoSearchResults = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm"
    >
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-semibold mb-4">無此課程</h2>
        <p className="text-gray-500 text-md mb-8">
          找不到與「{searchQuery}」相關的課程，請嘗試其他關鍵字
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery("");
            setFilter({ search: "" });
          }}
          className="text-gray-700 border-gray-300 hover:bg-gray-100"
        >
          清除搜尋條件
        </Button>
      </div>
    </motion.div>
  );

  const shouldShowContent = isPageInitialized;

  return (
    <>
      {/* 全螢幕 Loading */}
      <ScreenLoading />

      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-4 mb-8">
          {/* 標題區域 */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">課程管理</h1>
              {shouldShowContent && pagination.totalItems > 0 && (
                <p className="text-gray-500 mt-1">
                  共 {pagination.totalItems} 個課程
                </p>
              )}
            </div>
            {shouldShowContent && pagination.totalItems > 0 && (
              <Button
                onClick={() => navigate(ADMIN_ROUTES.CREATE_COURSE)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                建立課程
              </Button>
            )}
          </div>

          {/* 搜尋區域 - 只在頁面初始化後顯示 */}
          {shouldShowContent && (
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="搜尋課程名稱..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* 內容區域 */}
        {shouldShowContent && (
          <>
            {courses.length === 0 ? (
              // 區分沒有課程和搜尋無結果兩種情況
              (filter.search && filter.search.trim() !== "") ||
              searchQuery.trim() !== "" ? (
                // 有搜尋條件但無結果
                <NoSearchResults />
              ) : (
                // 沒有搜尋條件且沒有課程，顯示建立新課程
                <EmptyState />
              )
            ) : (
              // 正常顯示課程列表 - 響應式設計：手機版1張、中螢幕2張、大螢幕3張
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    index={index}
                    onClick={() =>
                      navigate(
                        `${ADMIN_ROUTES.COURSE_INFO.replace(
                          ":courseId",
                          course.id
                        )}`
                      )
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* 分頁控制 - 響應式設計 */}
        {shouldShowContent &&
          pagination.totalItems > 0 &&
          pagination.totalPages > 1 && (
            <div className="mt-8 px-2 py-4">
              {/* 桌面版：單行布局 */}
              <div className="hidden sm:flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  第 {pagination.currentPage} 頁，共 {pagination.totalPages} 頁
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`px-3 py-2 text-sm ${
                      pagination.currentPage <= 1
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
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
                          page === pagination.currentPage ? "default" : "ghost"
                        }
                        size="sm"
                        className={`px-3 py-2 min-w-[40px] text-sm ${
                          page === pagination.currentPage
                            ? "bg-gray-700 text-white hover:bg-gray-800"
                            : "text-gray-600 hover:bg-gray-300"
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    className={`px-3 py-2 text-sm ${
                      pagination.currentPage >= pagination.totalPages
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    下一頁
                  </Button>
                </div>
              </div>

              {/* 手機版：兩列布局 */}
              <div className="sm:hidden space-y-3">
                {/* 第一列：頁碼切換 */}
                <div className="flex justify-center items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`px-3 py-2 text-xs ${
                      pagination.currentPage <= 1
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
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
                          page === pagination.currentPage ? "default" : "ghost"
                        }
                        size="sm"
                        className={`px-2 py-2 min-w-[32px] text-xs ${
                          page === pagination.currentPage
                            ? "bg-gray-700 text-white hover:bg-gray-800"
                            : "text-gray-600 hover:bg-gray-300"
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    className={`px-3 py-2 text-xs ${
                      pagination.currentPage >= pagination.totalPages
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    下一頁
                  </Button>
                </div>

                {/* 第二列：總數統計 */}
                <div className="flex justify-center">
                  <span className="text-xs text-muted-foreground">
                    第 {pagination.currentPage} 頁，共 {pagination.totalPages}{" "}
                    頁
                  </span>
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
}
