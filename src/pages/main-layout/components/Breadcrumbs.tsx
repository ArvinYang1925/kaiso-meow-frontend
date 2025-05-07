import React, { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const { items, setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    // 設置麵包屑
    setBreadcrumbs(location.pathname, params);
  }, [location.pathname, params, setBreadcrumbs]);

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          <Link
            to={item.path}
            className={`hover:text-foreground ${
              index === items.length - 1
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            }`}
          >
            {item.title}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};
