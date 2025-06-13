import { Params } from "react-router-dom";

export interface BreadcrumbItem {
  path: string;
  title: string;
}

export interface RouteConfig {
  path: string;
  title: string;
  children?: Record<string, RouteConfig>;
}

export interface BreadcrumbState {
  items: BreadcrumbItem[];
  setBreadcrumbs: (pathname: string, params: Params<string>) => void;
}
