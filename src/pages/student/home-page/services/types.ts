import { Pagination } from "@/services/types";

export type CourseItem = {
    id: string;
    title: string;
    instructorName: string;
    coverUrl: string;
    price: string;
}

export type CourseListResponse = {
    status: 'success';
    data: {
        courseList: CourseItem[];
        pagination: Pagination;
    };
}