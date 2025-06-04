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
    // 如果是變更密碼頁面，直接設定麵包屑
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

    // 如果是課程相關頁面，直接設定麵包屑
    if (pathname.includes("/admin/courses/")) {
      const courseId = params.courseId;
      const pathSnippets = pathname.split("/").filter((i) => i);
      const lastPath = pathSnippets[pathSnippets.length - 1];

      // 根據課程 ID 獲取對應的課程名稱
      let courseName = "課程";
      if (courseId) {
        try {
          const courseData = await getCourseById(courseId);
          courseName = courseData.title;
        } catch (error) {
          console.error("Error fetching course name:", error);
          courseName = "課程";
        }
      }

      const items = [
        {
          path: "/admin",
          title: "管理後台",
        },
        {
          path: "/admin/courses",
          title: "課程",
        },
      ];

      // 如果有課程 ID，加入課程名稱
      if (courseId) {
        items.push({
          path: `/admin/courses/${courseId}`,
          title: courseName,
        });
      }

      // 根據最後的路徑片段加入對應的標題
      switch (lastPath) {
        case "info":
          items.push({
            path: `/admin/courses/${courseId}/info`,
            title: "課程資訊",
          });
          break;
        case "sessions":
          items.push({
            path: `/admin/courses/${courseId}/sessions`,
            title: "課程章節",
          });
          break;
        case "publishing":
          items.push({
            path: `/admin/courses/${courseId}/publishing`,
            title: "發佈/下架",
          });
          break;
        case "create":
          items.push({
            path: "/admin/courses/create",
            title: "建立課程",
          });
          break;
      }

      set({ items });
      return;
    }

    // 處理一般路由
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

    // 確保麵包屑項目是唯一的
    const uniqueItems = items.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.path === item.path)
    );

    set({ items: uniqueItems });
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
