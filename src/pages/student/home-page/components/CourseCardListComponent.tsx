import { CourseCard } from "@/components/features/CourseCard";
import { useHomePageStore } from "../store/homePageStore";
import { useEffect } from "react";

const CourseCardListComponent: React.FC = () => {
  const { courseCardList, fetchCourseCardList } = useHomePageStore();

  useEffect(()=>{
    fetchCourseCardList()
  },[])

  return (
    <div className="course-card-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {courseCardList.map((course) => (
        <CourseCard
          id={course.id}
          key={course.id}
          title={course.title}
          instructorName={course.instructorName}
          coverUrl={course.coverUrl}
          price={course.price}
        />
      ))}
    </div>
  );
};

export default CourseCardListComponent;
