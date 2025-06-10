import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import { useCourseStore } from "./courseManagementStore";
import { useScreenLoading } from "@/components/common/useScreenLoading";
import { ADMIN_ROUTES } from "@/app/route-path";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Eye, EyeOff, Trash2, Globe, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CoursePublishingManagementPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumbStore();
  const { toast } = useToast();

  // 全螢幕 Loading
  const { ScreenLoading, withLoading } = useScreenLoading();

  // 使用課程 store
  const {
    currentCourse,
    isUpdating,
    isDeleting,
    fetchCourseDetail,
    togglePublishCourse,
    removeCourse,
    resetCurrentCourse,
  } = useCourseStore();

  const [isPublished, setIsPublished] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "無效的課程 ID",
      });
      navigate(ADMIN_ROUTES.COURSES);
      return;
    }

    // 設定麵包屑
    setBreadcrumbs(
      ADMIN_ROUTES.COURSE_PUBLISHING_MANAGEMENT.replace(":courseId", courseId),
      { courseId }
    );

    // 頁面初始載入 - 使用全域 LOADING
    const initializePage = async () => {
      resetCurrentCourse();

      try {
        await withLoading(
          () => fetchCourseDetail(courseId),
          "正在載入課程發佈資料..."
        );
      } catch {
        toast({
          variant: "destructive",
          title: "載入失敗",
          description: "載入課程資料時發生錯誤，請稍後再試",
        });
      } finally {
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 100);
      }
    };

    initializePage();
  }, [
    courseId,
    setBreadcrumbs,
    fetchCourseDetail,
    resetCurrentCourse,
    navigate,
    toast,
    withLoading,
  ]);

  // 當課程資料載入完成時，更新發佈狀態
  useEffect(() => {
    if (currentCourse) {
      setIsPublished(currentCourse.isPublished || false);
    }
  }, [currentCourse]);

  // 處理發佈狀態切換
  const handlePublishToggle = async (checked: boolean) => {
    if (!courseId) return;

    try {
      const success = await togglePublishCourse(courseId, checked);

      if (success) {
        setIsPublished(checked);
        toast({
          title: checked ? "課程已發佈" : "課程已下架",
          description: checked
            ? "學生現在可以看到並購買此課程"
            : "課程已從公開列表中移除",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "操作失敗",
        description: "更新課程狀態時發生錯誤，請稍後再試",
      });
    }
  };

  // 處理刪除課程
  const handleDeleteCourse = async () => {
    if (!courseId) {
      toast({
        variant: "destructive",
        title: "刪除失敗",
        description: "無效的課程 ID",
      });
      return;
    }

    try {
      // 確保對話框關閉
      setDeleteDialogOpen(false);

      const success = await removeCourse(courseId);

      if (success) {
        toast({
          title: "課程已刪除",
          description: "課程已從系統中永久移除",
        });

        // 稍微延遲導航，確保用戶看到成功訊息
        setTimeout(() => {
          navigate(ADMIN_ROUTES.COURSES);
        }, 1500);
      } else {
        setTimeout(() => {
          toast({
            variant: "destructive",
            title: "刪除失敗",
            description: "無法刪除課程，請檢查課程狀態後重試",
          });
        }, 100);
      }
    } catch (error) {
      let errorMessage = "刪除課程時發生錯誤，請稍後再試";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // 確保錯誤訊息顯示
      toast({
        variant: "destructive",
        title: "刪除失敗",
        description: errorMessage,
      });
    }
  };

  // 只有在非初始載入狀態下且找不到課程時，才顯示錯誤頁面
  if (!isInitialLoading && !currentCourse) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">找不到課程</h2>
          <p className="text-gray-500 mb-6">您要管理的課程不存在或已被刪除。</p>
          <Button onClick={() => navigate(ADMIN_ROUTES.COURSES)}>
            返回課程列表
          </Button>
        </div>
      </div>
    );
  }

  // 正在初始載入，只顯示 Loading
  if (isInitialLoading) {
    return <ScreenLoading />;
  }

  return (
    <>
      {/* 全螢幕 Loading 組件 */}
      <ScreenLoading />

      <div className="p-6">
        <div>
          <h1 className="mb-8 text-2xl font-bold">發佈/下架課程</h1>
        </div>

        {/* 課程基本資訊 */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">{currentCourse!.title}</h2>
          <p className="text-sm text-gray-600">{currentCourse!.subtitle}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>課程 ID: {courseId}</span>
            <span>•</span>
            <span>類型: {currentCourse!.isFree ? "免費課程" : "付費課程"}</span>
            {!currentCourse!.isFree && (
              <>
                <span>•</span>
                <span>價格: NT$ {currentCourse!.price}</span>
              </>
            )}
            <span>•</span>
            <span
              className={`font-medium ${
                isPublished ? "text-green-600" : "text-yellow-600"
              }`}
            >
              狀態: {isPublished ? "已上架" : "已下架"}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* 第一個區塊：發佈/下架管理 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mb-1">
                {isPublished ? (
                  <Globe className="h-5 w-5 text-green-600" />
                ) : (
                  <Lock className="h-5 w-5 text-gray-400" />
                )}
                課程發佈狀態
              </CardTitle>
              <CardDescription className="mt-1 ml-7">
                控制課程是否對學生公開顯示。下架的課程將從課程列表中隱藏，已購買的學生仍可繼續觀看。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 當前狀態提示 */}
              <div
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  isPublished
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-yellow-50 text-yellow-800 border border-yellow-200"
                }`}
              >
                {isPublished ? (
                  <Eye className="h-5 w-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <EyeOff className="h-5 w-5 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-medium">
                    {isPublished ? "課程已發佈" : "課程已下架"}
                  </h3>
                  <p className="text-sm mt-1">
                    {isPublished
                      ? "學生可以在課程列表中看到並購買此課程"
                      : "課程目前未公開，學生無法在列表中看到此課程"}
                  </p>
                </div>
              </div>

              {/* 發佈/下架切換開關 */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label
                    htmlFor="publish-toggle"
                    className="text-base font-medium"
                  >
                    {isPublished ? "下架課程" : "發佈課程"}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {isPublished
                      ? "將課程從公開列表中移除"
                      : "讓學生可以看到並購買此課程"}
                  </p>
                </div>
                <Switch
                  id="publish-toggle"
                  checked={isPublished}
                  onCheckedChange={handlePublishToggle}
                  disabled={isUpdating}
                />
              </div>

              {/* 操作提示 */}
              {!isPublished && (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 border border-blue-200">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">發佈提醒</h3>
                    <p className="text-sm mt-1">
                      發佈前請確認課程內容完整。發佈後學生即可購買和觀看。
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 第二個區塊：刪除課程 */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="mb-1 flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                刪除課程
              </CardTitle>
              <CardDescription className="mt-1 ml-7">
                永久刪除此課程。此操作無法復原，請謹慎操作。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 根據課程狀態顯示不同警告訊息 */}
              {isPublished ? (
                /* 已上架課程的特別警告 */
                <div className="bg-orange-50 text-orange-800 p-4 rounded-lg flex items-start gap-3 border border-orange-200">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">無法刪除已上架課程</h3>
                    <p className="text-sm mt-1">
                      此課程目前已上架，無法直接刪除。請先將課程下架，然後才能進行刪除操作。
                    </p>
                  </div>
                </div>
              ) : (
                /* 已下架課程的一般警告訊息 */
                <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-start gap-3 border border-red-200">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">刪除警告</h3>
                    <p className="text-sm mt-1">
                      刪除課程後，所有相關的課程內容、學生進度、評論和統計資料都會被永久移除。
                      已購買此課程的學生將無法再觀看課程內容。
                    </p>
                  </div>
                </div>
              )}

              {/* 刪除按鈕 */}
              <div className="pt-2 flex justify-end">
                <AlertDialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                      disabled={isDeleting || isPublished}
                    >
                      {isDeleting ? "刪除中..." : "刪除課程"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        確認刪除課程
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-2">
                        <p>您即將永久刪除課程：</p>
                        <p className="font-medium text-gray-900">
                          "{currentCourse!.title}"
                        </p>
                        <p className="text-red-600 font-medium">
                          此操作無法復原！所有課程內容、學生資料和統計資訊都會被永久移除。
                        </p>
                        {isPublished && (
                          <p className="text-orange-600 font-medium">
                            注意：此課程目前已上架，請先下架後再進行刪除。
                          </p>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        disabled={isDeleting}
                        onClick={() => {
                          setDeleteDialogOpen(false);
                        }}
                      >
                        取消
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteCourse();
                        }}
                        disabled={isDeleting || isPublished}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                      >
                        {isDeleting ? "刪除中..." : "確認刪除"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
