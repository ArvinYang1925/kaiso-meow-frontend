import React, { useState, useEffect } from "react";
import { MyLearningCourseCard } from "@/components/features/MyLearningCourseCard";
import { myLearningService } from "@/services/myLearningService";
import { MyCourse } from "@/types/course";

const MyLearningPage: React.FC = () => {
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 9,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchMyCourses = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await myLearningService.getMyLearningCourses(page, 9);

      if (response.status === "success") {
        setCourses(response.data);
        setPagination(response.pagination);
      } else {
        setError("載入課程失敗");
      }
    } catch (err) {
      console.error("Error fetching my learning courses:", err);
      setError("載入課程時發生錯誤");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchMyCourses(page);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-8">我的學習</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <MyLearningCourseCard
              key={i}
              courseId=""
              title=""
              coverUrl=""
              progressPercentage={0}
              instructorName=""
              isLoading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-8">我的學習</h1>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-2">載入失敗</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchMyCourses()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-8">我的學習</h1>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            還沒有學習中的課程
          </h2>
          <p className="text-gray-500 mb-4">開始探索我們的課程吧！</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            瀏覽課程
          </button>
        </div>
      ) : (
        <>
          {/* Course Grid */}
          <div className="course-card-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((course) => (
              <MyLearningCourseCard
                key={course.courseId}
                courseId={course.courseId}
                title={course.title}
                coverUrl={course.coverUrl}
                progressPercentage={course.progressPercentage}
                instructorName={course.instructorName}
                isReady={course.isReady}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一頁
                </button>

                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded ${
                        pagination.currentPage === page
                          ? "bg-orange-500 text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一頁
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyLearningPage;
