import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import RichTextEditor from "@/pages/admin/instructor-course-page/components/RichTextEditor";

export default function CoursesCreatePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    price: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: 實現課程創建邏輯
      console.log("創建課程:", formData);
      navigate(ADMIN_ROUTES.COURSES);
    } catch (error) {
      console.error("創建課程失敗:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 左側：課程資訊 */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-6">課程資訊</h2>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="mb-1">課程名稱</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="請輸入課程名稱"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    一個引人注目且簡單的課程名稱可以幫助您吸引更多的學生。
                  </p>
                </div>

                <div>
                  <Label htmlFor="subtitle" className="mb-1">課程副標題</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="例：深入淺出的講解，從零開始完全掌握..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    在課程名稱下方顯示，您可以為課程添加額外的說明、性格和或標語。
                  </p>
                </div>

                <div>
                  <Label htmlFor="description" className="mb-1">課程介紹</Label>
                  <RichTextEditor
                    id="description"
                    value={formData.description}
                    onChange={(content) => setFormData({ ...formData, description: content })}
                    minHeight={200}
                    maxHeight={398}
                  />
                </div>

                <div>
                  <Label htmlFor="title" className="mb-1">課程亮點</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="請輸入課程名稱"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    列出本課程的學習亮點將有助於學生更好地理解你的課程內容。
                  </p>
                </div>

                <div>
                  <Label htmlFor="price" className="mb-1">課程價格</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(ADMIN_ROUTES.COURSES)}
                  >
                    取消
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "建立中..." : "建立課程"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 右側：課程縮圖 */}
        <div className="md:w-4/12 w-full">
          <h2 className="text-xl font-bold mb-6">課程縮圖</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-900">
              封面圖片
              </p>
              <div className="h-48 bg-white/50 rounded-md mt-4 flex items-center justify-center border border-amber-200">
                <span className="text-amber-600 font-medium">將圖片拖曳到此處或按一下以選擇圖片</span>
                <span className="text-slate-500 font-medium">建議尺寸為 1200x628</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 