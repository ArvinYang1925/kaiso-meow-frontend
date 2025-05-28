import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function CoursesDeactivatePage() {
  const { courseId } = useParams();
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    // 設定麵包屑
    setBreadcrumbs(
      ADMIN_ROUTES.DEACTIVATE_COURSE.replace(":courseId", courseId || ""),
      { courseId }
    );
  }, [courseId, setBreadcrumbs]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">下架課程</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start">
            <AlertCircle className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium">警告</h3>
              <p className="text-sm">
                下架課程後，學生將無法再購買或觀看此課程。此操作無法復原，請謹慎操作。
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-start gap-2">
              <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                確認下架
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 