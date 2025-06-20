import { CourseCard } from "@/components/features/CourseCard";
import { useHomePageStore } from "../store/homePageStore";
import { useEffect } from "react";

const CourseCardListComponent: React.FC = () => {
  const { courseCardList, fetchCourseCardList, isLoading } = useHomePageStore();

  useEffect(() => {
    fetchCourseCardList();
  }, []);

  return (
    <div className="course-card-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <CourseCard key={index} id="" title="" instructorName="" coverUrl="" price={0} isLoading={true} />
        ))
      ) : courseCardList.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">目前尚無課程資料</p>
      ) : (
        courseCardList.map((course) => (
          <CourseCard
            id={course.id}
            key={course.id}
            title={course.title}
            instructorName={course.instructorName}
            coverUrl={course.coverUrl}
            price={course.price}
            isReady={course.isReady}
          />
        ))
      )}
    </div>
  );
};

export default CourseCardListComponent;
