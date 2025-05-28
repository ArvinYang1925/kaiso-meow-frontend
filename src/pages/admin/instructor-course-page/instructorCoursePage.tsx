import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import { instructorMockCoursesData } from "./data/instructorMockData";
import { motion } from "framer-motion";

interface Course {
  id: string;
  title: string;
  instructor: string;
  imageUrl: string;
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setBreadcrumbs } = useBreadcrumbStore();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // 設置麵包屑
    setBreadcrumbs(location.pathname, {});

    const fetchCourses = async () => {
      // 模擬資料
      const convertedCourses = instructorMockCoursesData.map(course => ({
        id: course.id,
        title: course.title,
        instructor: course.instructorName,
        imageUrl: course.coverUrl
      }));
      setCourses(convertedCourses);
    };

    fetchCourses();
  }, [setBreadcrumbs, location.pathname]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">課程</h1>
        <Button onClick={() => navigate(ADMIN_ROUTES.CREATE_COURSE)}>
          <Plus className="w-4 h-4 mr-2" />
          建立課程
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-none bg-transparent"
            onClick={() => navigate(`${ADMIN_ROUTES.COURSE_INFO.replace(":courseId", course.id)}`)}
          >
            <CardHeader className="p-0 h-[60%] overflow-hidden">
              <motion.img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover rounded-t-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
              />
            </CardHeader>
            <CardContent className="p-4 h-[40%] border-0 bg-transparent">
              <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
              <p className="text-sm text-gray-500">講師：{course.instructor}</p>
            </CardContent>
          </div>
        ))}
      </div>
    </div>
  );
}
