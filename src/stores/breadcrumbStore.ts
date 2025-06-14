import { create } from "zustand";
import { ADMIN_ROUTES } from "@/app/route-path";
import { ROUTE_TITLES } from "@/app/route-titles";
import { Params } from "react-router-dom";
import {
  BreadcrumbItem,
  RouteConfig,
  BreadcrumbState,
} from "@/types/breadcrumb";
import { getCourseById } from "../services/breadcrumb.service";

const routeConfigs: Record<string, RouteConfig> = {
  dashboard: {
    path: ADMIN_ROUTES.DASHBOARD,
    title: ROUTE_TITLES[ADMIN_ROUTES.DASHBOARD],
  },
  courses: {
    path: ADMIN_ROUTES.COURSES,
    title: ROUTE_TITLES[ADMIN_ROUTES.COURSES],
    children: {
      create: {
        path: ADMIN_ROUTES.CREATE_COURSE,
        title: ROUTE_TITLES[ADMIN_ROUTES.CREATE_COURSE],
      },
      list: {
        path: ADMIN_ROUTES.COURSELIST,
        title: ROUTE_TITLES[ADMIN_ROUTES.COURSELIST],
      },
      ":courseId": {
        path: `${ADMIN_ROUTES.COURSES}/:courseId`,
        title: ":courseName",
        children: {
          info: {
            path: `${ADMIN_ROUTES.COURSES}/:courseId/info`,
            title: ROUTE_TITLES[ADMIN_ROUTES.COURSE_INFO],
          },
          sections: {
            path: `${ADMIN_ROUTES.COURSES}/:courseId/sections`,
            title: ROUTE_TITLES[ADMIN_ROUTES.SECTION_MANAGEMENT],
          },
          publishing: {
            path: `${ADMIN_ROUTES.COURSES}/:courseId/publishing`,
            title: ROUTE_TITLES[ADMIN_ROUTES.COURSE_PUBLISHING_MANAGEMENT],
          },
        },
      },
    },
  },
  students: {
    path: ADMIN_ROUTES.STUDENTS,
    title: ROUTE_TITLES[ADMIN_ROUTES.STUDENTS],
  },
  orders: {
    path: ADMIN_ROUTES.INSTRUCTOR_ORDERS,
    title: ROUTE_TITLES[ADMIN_ROUTES.INSTRUCTOR_ORDERS],
  },
  coupons: {
    path: ADMIN_ROUTES.COUPONS,
    title: ROUTE_TITLES[ADMIN_ROUTES.COUPONS],
  },
  me: {
    path: ADMIN_ROUTES.ME,
    title: ROUTE_TITLES[ADMIN_ROUTES.ME],
    children: {
      "change-password": {
        path: ADMIN_ROUTES.CHANGE_PASSWORD,
        title: ROUTE_TITLES[ADMIN_ROUTES.CHANGE_PASSWORD],
      },
    },
  },
};

const processRoute = (
  pathSnippets: string[],
  params: Params<string>,
  config: RouteConfig,
  basePath: string = ""
): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [];
  let currentPath = basePath ? `${basePath}/${config.path}` : config.path;

  // 處理動態參數
  if (config.path.includes(":courseId")) {
    currentPath = currentPath.replace(":courseId", params.courseId || "");
  }

  // 處理動態標題
  let title = config.title;
  if (title === ":courseName" && params.courseName) {
    title = params.courseName;
  }

  // 先加入當前路由
  items.push({
    path: currentPath,
    title: title,
  });

  // 處理子路由
  if (config.children && pathSnippets.length > 1) {
    const childKey = pathSnippets[1];
    const childConfig = config.children[childKey];

    if (childConfig) {
      const childItems = processRoute(
        pathSnippets.slice(1),
        params,
        childConfig,
        currentPath
      );
      items.push(...childItems);
    } else if (
      pathSnippets[1] === ":courseId" &&
      config.children[":courseId"]
    ) {
      // 特別處理課程 ID 的情況
      const courseConfig = config.children[":courseId"];
      const courseItems = processRoute(
        pathSnippets.slice(1),
        params,
        courseConfig,
        currentPath
      );
      items.push(...courseItems);
    }
  }

  return items;
};

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  items: [
    {
      path: "/admin",
      title: "管理後台",
    },
  ],
  setBreadcrumbs: async (pathname: string, params: Params) => {
    // 如果是變更密碼頁面
    if (pathname === ADMIN_ROUTES.CHANGE_PASSWORD) {
      set({
        items: [
          {
            path: ADMIN_ROUTES.HOME,
            title: "管理後台",
          },
          {
            path: ADMIN_ROUTES.ME,
            title: "個人設定",
          },
          {
            path: ADMIN_ROUTES.CHANGE_PASSWORD,
            title: "變更密碼",
          },
        ],
      });
      return;
    }

    // 如果是課程相關頁面
    if (pathname.includes("/admin/courses")) {
      const items: BreadcrumbItem[] = [
        {
          path: "/admin",
          title: "管理後台",
        },
      ];

      // 處理創建課程頁面
      if (pathname === ADMIN_ROUTES.CREATE_COURSE) {
        items.push(
          {
            path: ADMIN_ROUTES.COURSES,
            title: "課程管理",
          },
          {
            path: ADMIN_ROUTES.CREATE_COURSE,
            title: ROUTE_TITLES[ADMIN_ROUTES.CREATE_COURSE],
          }
        );
        set({ items });
        return;
      }

      // 處理課程列表頁面
      if (
        pathname === ADMIN_ROUTES.COURSES ||
        pathname === ADMIN_ROUTES.COURSELIST
      ) {
        items.push({
          path: ADMIN_ROUTES.COURSES,
          title: "課程管理",
        });
        set({ items });
        return;
      }

      // 處理課程詳細頁面
      const courseId = params.courseId;
      if (courseId) {
        try {
          const courseData = await getCourseById(courseId);
          const courseName = courseData.title;

          // 添加課程管理
          items.push({
            path: ADMIN_ROUTES.COURSES,
            title: "課程管理",
          });

          // 根據不同的子頁面添加對應的麵包屑
          if (pathname.endsWith("/info")) {
            items.push(
              {
                path: `/admin/courses/${courseId}/info`,
                title: courseName,
              },
              {
                path: `/admin/courses/${courseId}/info`,
                title: "課程資訊",
              }
            );
          } else if (pathname.endsWith("/sections")) {
            items.push(
              {
                path: `/admin/courses/${courseId}/info`,
                title: courseName,
              },
              {
                path: `/admin/courses/${courseId}/sections`,
                title: "章節管理",
              }
            );
          } else if (pathname.endsWith("/publishing")) {
            items.push(
              {
                path: `/admin/courses/${courseId}/info`,
                title: courseName,
              },
              {
                path: `/admin/courses/${courseId}/publishing`,
                title: "發佈/下架",
              }
            );
          }
        } catch (error) {
          console.error("Error fetching course name:", error);
          items.push(
            {
              path: ADMIN_ROUTES.COURSES,
              title: "課程管理",
            },
            {
              path: `/admin/courses/${courseId}/info`,
              title: "課程",
            },
            {
              path: `/admin/courses/${courseId}/info`,
              title: "課程資訊",
            }
          );
        }
      }

      set({ items });
      return;
    }

    // 處理其他一般路由
    const pathSnippets = pathname.split("/").filter((i) => i);
    const items: BreadcrumbItem[] = [
      {
        path: "/admin",
        title: "管理後台",
      },
    ];

    if (pathSnippets.length > 0) {
      const mainRoute = pathSnippets[0];
      const config = routeConfigs[mainRoute];

      if (config) {
        const routeItems = processRoute(pathSnippets, params, config);
        // 確保不添加重複的項目
        routeItems.forEach((item) => {
          if (!items.some((existing) => existing.path === item.path)) {
            items.push(item);
          }
        });
      } else {
        const currentPath = `/${pathSnippets.join("/")}`;
        const title = ROUTE_TITLES[currentPath as keyof typeof ROUTE_TITLES];
        if (title) {
          items.push({
            path: currentPath,
            title: title,
          });
        }
      }
    }

    set({ items });
  },
  getBreadcrumbItems: async (
    pathname: string,
    params: Params
  ): Promise<BreadcrumbItem[]> => {
    const pathSnippets = pathname.split("/").filter((i) => i);
    const items: BreadcrumbItem[] = [
      {
        path: "/admin",
        title: "管理後台",
      },
    ];

    if (pathSnippets.length > 0) {
      const mainRoute = pathSnippets[0];
      const config = routeConfigs[mainRoute];

      if (config) {
        const routeItems = processRoute(pathSnippets, params, config);
        items.push(...routeItems);
      } else {
        const currentPath = `/${pathSnippets.join("/")}`;
        const title = ROUTE_TITLES[currentPath as keyof typeof ROUTE_TITLES];
        if (title) {
          items.push({
            path: currentPath,
            title: title,
          });
        }
      }
    }

    return items;
  },
}));
