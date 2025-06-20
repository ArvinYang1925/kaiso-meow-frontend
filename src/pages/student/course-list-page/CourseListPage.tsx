import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import logo from "@/assets/catschool_logo.svg";
import { useScreenLoading } from "@/components/common/useScreenLoading";
import { fetchCourseCardList } from "@/pages/student/home-page/services/home-page.service";
import { CourseItem } from "@/pages/student/home-page/services/types";
import { useNavigate } from "react-router-dom";

// 預設圖片URL
const DEFAULT_COURSE_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/kaiso-meow-backend.firebasestorage.app/o/images%2Fcourse_cover%2Fdefault_cover%2Fdefault_lesson_cover.png?alt=media&token=9e27fcc9-5a48-4e9b-b876-d0cdeb2230fd";

// 圖片錯誤處理 Hook
const useImageWithFallback = (initialSrc: string | undefined) => {
  const [imageSrc, setImageSrc] = useState(initialSrc || DEFAULT_COURSE_IMAGE);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (imageSrc !== DEFAULT_COURSE_IMAGE) {
      setHasError(true);
      setImageSrc(DEFAULT_COURSE_IMAGE);
    }
  };

  return [imageSrc, handleImageError, hasError] as const;
};

// 課程卡片組件
interface AnimatedCourseCardProps {
  course: CourseItem;
  index: number;
}

const AnimatedCourseCard: React.FC<AnimatedCourseCardProps> = ({
  course,
  index,
}) => {
  const navigate = useNavigate();
  const [imageSrc, handleImageError] = useImageWithFallback(course.coverUrl);

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
      className="h-full"
    >
      <Card
        className="overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col"
        style={{ minHeight: "400px" }}
      >
        <CardHeader className="p-0 relative flex-shrink-0">
          <div className="relative overflow-hidden">
            <motion.div
              whileHover={{
                scale: 1.08,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              className="overflow-hidden"
            >
              <img
                src={imageSrc}
                alt={course.title}
                className="w-full h-full object-cover object-center transition-all duration-500"
                style={{ height: "264px" }}
                onError={handleImageError}
              />
            </motion.div>

            {/* 懸停時的額外效果 */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 pointer-events-none"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* 課程準備中覆蓋層 */}
            {!course.isReady && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-orange-200 text-orange-800 px-4 py-2 rounded-lg font-medium">
                  課程準備中
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 p-4 flex-1">
          {/* 小標題 */}
          <motion.h4
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-lg font-semibold text-gray-900"
          >
            {course.title}
          </motion.h4>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="logo-section flex items-center"
          >
            <Avatar className="cursor-pointer p-1 ring-1 ring-gray-300 me-2">
              <AvatarImage className="scale-x-[-1]" src={logo} />
            </Avatar>
            <h5>{course.instructorName}</h5>
          </motion.div>

          {/* 價格與按鈕 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="flex items-center justify-between mt-auto"
          >
            <span className="text-xl font-bold text-sky-600">
              {course.price === 0
                ? "免費"
                : `NT$ ${course.price.toLocaleString()}`}
            </span>
            <Button
              variant="outline"
              className={`bg-orange-500 text-white hover:bg-orange-600 hover:text-gray ${
                !course.isReady ? "opacity-40 cursor-not-allowed" : ""
              }`}
              disabled={!course.isReady}
              onClick={(e) => {
                e.stopPropagation();
                if (course.isReady) {
                  navigate(`/course/${course.id}`);
                }
              }}
            >
              {course.isReady ? "查看詳情" : "課程準備中"}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CourseListPage: React.FC = () => {
  const [allCourses, setAllCourses] = useState<CourseItem[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseItem[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState<CourseItem[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 9,
    totalPages: 1,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isPageInitialized, setIsPageInitialized] = useState(false);
  const { ScreenLoading, withLoading } = useScreenLoading();

  // 前端搜尋篩選函數
  const filterCourses = (courses: CourseItem[], searchTerm: string) => {
    if (!searchTerm.trim()) {
      return courses;
    }

    const term = searchTerm.toLowerCase().trim();
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.instructorName.toLowerCase().includes(term)
    );
  };

  // 分頁處理函數
  const paginateCourses = (
    courses: CourseItem[],
    page: number,
    pageSize: number
  ) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return courses.slice(startIndex, endIndex);
  };

  // 更新顯示的課程和分頁資訊
  const updateDisplayedCourses = useCallback(
    (filtered: CourseItem[], currentPage: number = 1) => {
      const pageSize = 9;
      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const safePage = Math.min(currentPage, Math.max(1, totalPages));

      const displayed = paginateCourses(filtered, safePage, pageSize);

      setFilteredCourses(filtered);
      setDisplayedCourses(displayed);
      setPagination((prev) => ({
        ...prev,
        currentPage: safePage,
        totalPages: totalPages || 1,
        totalItems,
        pageSize,
      }));
    },
    []
  );

  // 頁面初始化
  useEffect(() => {
    const initializeCoursePage = async () => {
      setAllCourses([]);
      setFilteredCourses([]);
      setDisplayedCourses([]);
      setIsPageInitialized(false);

      try {
        const response = await withLoading(
          () => fetchCourseCardList(1, 100),
          "正在載入課程列表..."
        );

        if (response.status === "success" && response.data) {
          const courses = response.data.courseList;
          setAllCourses(courses);
          updateDisplayedCourses(courses, 1);
        }
      } finally {
        setIsPageInitialized(true);
      }
    };

    initializeCoursePage();
  }, [withLoading, updateDisplayedCourses]);

  // 處理分頁切換
  const handlePageChange = (page: number) => {
    updateDisplayedCourses(filteredCourses, page);
  };

  // 處理搜尋
  const handleSearch = () => {
    const filtered = filterCourses(allCourses, searchTerm);
    updateDisplayedCourses(filtered, 1);
  };

  // 空狀態組件
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16 flex-1 flex flex-col justify-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-gray-500 mb-4"
      >
        {searchTerm.trim()
          ? `找不到符合 "${searchTerm}" 的課程`
          : "暫無課程資料"}
      </motion.div>
      {searchTerm.trim() && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSearchTerm("");
            updateDisplayedCourses(allCourses, 1);
          }}
          className="text-blue-500 hover:text-blue-600 underline transition-colors"
        >
          清除搜尋條件
        </motion.button>
      )}
    </motion.div>
  );

  const shouldShowContent = isPageInitialized;

  return (
    <>
      {/* 全螢幕 Loading */}
      <ScreenLoading />

      <div className="min-h-[calc(100vh-120px)] flex flex-col">
        <div className="flex-1 space-y-8 px-6 pt-10">
          {shouldShowContent && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full lg:flex lg:justify-end">
                  <div className="w-full lg:w-[calc((100%-5rem)/3)]">
                    <div className="grid grid-cols-1 gap-4">
                      {/* 搜尋框和按鈕 */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center space-x-1 w-full"
                      >
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="text"
                          placeholder="搜尋課程..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSearch();
                            }
                          }}
                          className="flex-1 px-3 py-2 text-sm sm:px-2 sm:py-2 sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={handleSearch}
                            className="ms-2 px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
                          >
                            搜尋
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 課程內容區域 */}
          {shouldShowContent && (
            <div className="flex-1 flex flex-col">
              {displayedCourses.length === 0 ? (
                <EmptyState />
              ) : (
                // 課程列表 - 確保卡片大小保持原樣
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="course-card-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1"
                >
                  {displayedCourses.map((course, index) => (
                    <AnimatedCourseCard
                      key={course.id}
                      course={course}
                      index={index}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {/* 分頁控制 */}
          {shouldShowContent && displayedCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
              {/* 手機版：兩列布局 */}
              <div className="block lg:hidden mt-8 mb-8 space-y-4">
                {/* 第一列：頁面信息 - 始終顯示 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="text-center text-sm text-gray-500"
                >
                  <div>
                    第 {pagination.currentPage} 頁，共 {pagination.totalPages}{" "}
                    頁
                  </div>
                  <div>（總共 {pagination.totalItems} 個課程）</div>
                </motion.div>

                {/* 第二列：分頁按鈕 - 只有多頁時才顯示 */}
                {pagination.totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="flex justify-center items-center space-x-2"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          pagination.currentPage <= 1
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-gray-700 border-gray-300 hover:bg-gray-200"
                        }
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={pagination.currentPage <= 1}
                      >
                        上一頁
                      </Button>
                    </motion.div>

                    {Array.from(
                      { length: Math.min(pagination.totalPages, 5) },
                      (_, index) => {
                        let page: number;
                        if (pagination.totalPages <= 5) {
                          page = index + 1;
                        } else {
                          const start = Math.max(1, pagination.currentPage - 2);
                          const end = Math.min(
                            pagination.totalPages,
                            start + 4
                          );
                          page = start + index;
                          if (page > end) return null;
                        }

                        return (
                          <motion.div
                            key={page}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.9 + index * 0.05,
                            }}
                          >
                            <Button
                              variant={
                                page === pagination.currentPage
                                  ? "outline"
                                  : "ghost"
                              }
                              size="sm"
                              className={
                                page === pagination.currentPage
                                  ? "text-gray-600 hover:bg-gray-100 hover:text-gray-500 cursor-not-allowed"
                                  : "text-gray-600 hover:bg-gray-300 hover:text-gray-700"
                              }
                              onClick={() => handlePageChange(page)}
                              disabled={page === pagination.currentPage}
                            >
                              {page}
                            </Button>
                          </motion.div>
                        );
                      }
                    )}

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={
                          pagination.currentPage >= pagination.totalPages
                        }
                        className={
                          pagination.currentPage >= pagination.totalPages
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-gray-700 border-gray-300 hover:bg-gray-200"
                        }
                      >
                        下一頁
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* 桌機版：單列布局，和三張卡片等寬 - 只有多頁時才顯示 */}
              {pagination.totalPages > 1 && (
                <div className="hidden lg:block mt-8 mb-8">
                  <div className="flex justify-between items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      className="flex items-center space-x-4 text-sm text-gray-500"
                    >
                      <span>
                        第 {pagination.currentPage} 頁，共{" "}
                        {pagination.totalPages} 頁
                      </span>
                      <span>（總共 {pagination.totalItems} 個課程）</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                      className="space-x-2 flex items-center"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            pagination.currentPage <= 1
                              ? "text-gray-400 border-gray-200 cursor-not-allowed"
                              : "text-gray-700 border-gray-300 hover:bg-gray-200"
                          }
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={pagination.currentPage <= 1}
                        >
                          上一頁
                        </Button>
                      </motion.div>

                      {Array.from(
                        { length: Math.min(pagination.totalPages, 5) },
                        (_, index) => {
                          let page: number;
                          if (pagination.totalPages <= 5) {
                            page = index + 1;
                          } else {
                            const start = Math.max(
                              1,
                              pagination.currentPage - 2
                            );
                            const end = Math.min(
                              pagination.totalPages,
                              start + 4
                            );
                            page = start + index;
                            if (page > end) return null;
                          }

                          return (
                            <motion.div
                              key={page}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.9 + index * 0.05,
                              }}
                            >
                              <Button
                                variant={
                                  page === pagination.currentPage
                                    ? "outline"
                                    : "ghost"
                                }
                                size="sm"
                                className={
                                  page === pagination.currentPage
                                    ? "text-gray-600 hover:bg-gray-100 hover:text-gray-500 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-gray-300 hover:text-gray-700"
                                }
                                onClick={() => handlePageChange(page)}
                                disabled={page === pagination.currentPage}
                              >
                                {page}
                              </Button>
                            </motion.div>
                          );
                        }
                      )}

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={
                            pagination.currentPage >= pagination.totalPages
                          }
                          className={
                            pagination.currentPage >= pagination.totalPages
                              ? "text-gray-400 border-gray-200 cursor-not-allowed"
                              : "text-gray-700 border-gray-300 hover:bg-gray-200"
                          }
                        >
                          下一頁
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseListPage;
