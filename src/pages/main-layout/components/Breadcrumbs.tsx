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
    <nav className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground overflow-x-auto">
      {items.map((item, index) => (
        <React.Fragment key={`breadcrumb-${index}-${item.path}`}>
          {index > 0 && (
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          )}
          <Link
            to={item.path}
            className={`hover:text-foreground whitespace-nowrap ${
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
