import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/pages/admin/instructor-course-page/components/RichTextEditor";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FileRejection, FileError } from "react-dropzone";

export default function CoursesCreatePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    price: "",
    courseType: "paid",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { toast } = useToast();

  const dropzoneOptions: DropzoneOptions = {
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    maxSize: 2 * 1024 * 1024, // 2MB
    maxFiles: 1,
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections && fileRejections.length > 0) {
        const isSizeError = fileRejections.some((rej: FileRejection) =>
          rej.errors.some((err: FileError) => err.code === "file-too-large")
        );
        if (isSizeError) {
          toast({
            variant: "destructive",
            title: "圖片大小超出限制，請上傳小於2MB的圖片",
          });
          return;
        }
      }
      if (acceptedFiles && acceptedFiles.length > 0) {
        setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
      }
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({ ...dropzoneOptions, onDrop });

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
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="title" className="mb-1">
                    課程名稱
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="請輸入課程名稱"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    一個引人注目且簡單的課程名稱可以幫助您吸引更多的學生。
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="subtitle" className="mb-1">
                    課程副標題
                  </Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    placeholder="例：深入淺出的講解，從零開始完全掌握..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    在課程名稱下方顯示，您可以為課程添加額外的說明、性格和或標語。
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description" className="mb-1">
                    課程介紹
                  </Label>
                  <RichTextEditor
                    id="description"
                    value={formData.description}
                    onChange={(content) =>
                      setFormData({ ...formData, description: content })
                    }
                    minHeight={200}
                    maxHeight={398}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="title" className="mb-1">
                    課程亮點
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="學習 xxx 的關鍵基礎知識"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    列出本課程的學習亮點將有助於學生更好地理解你的課程內容。
                  </p>
                </div>

                <div className="space-y-1">
                  <Label className="mb-1">課程類型</Label>
                  <div className="flex gap-4">
                    {/* 付費課程 */}
                    <label
                      className={`flex-1 border rounded-lg p-4 cursor-pointer flex items-start gap-2 transition
                        ${
                          formData.courseType === "paid"
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white"
                        }`}
                    >
                      <input
                        type="radio"
                        name="courseType"
                        value="paid"
                        checked={formData.courseType === "paid"}
                        onChange={() =>
                          setFormData({ ...formData, courseType: "paid" })
                        }
                        className="mt-1 accent-blue-500"
                      />
                      <div>
                        <div className="font-bold">付費課程</div>
                        <div className="text-sm text-gray-500">
                          您可以設定付費內容的價格和促銷條件。
                        </div>
                      </div>
                    </label>
                    {/* 免費課程/引導磁鐵 */}
                    <label
                      className={`flex-1 border rounded-lg p-4 cursor-pointer flex items-start gap-2 transition
                        ${
                          formData.courseType === "free"
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white"
                        }`}
                    >
                      <input
                        type="radio"
                        name="courseType"
                        value="free"
                        checked={formData.courseType === "free"}
                        onChange={() =>
                          setFormData({ ...formData, courseType: "free" })
                        }
                        className="mt-1 accent-blue-500"
                      />
                      <div>
                        <div className="font-bold">免費課程 / 引導磁鐵</div>
                        <div className="text-sm text-gray-500">
                          引導磁石允許用戶在註冊後兌換和解鎖內容，可用於增加和累積您的會員名單。
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="title" className="mb-1">
                    課程時長
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="請輸入課程時長"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    例如，對於10小時30分鐘，輸入
                    10.5。若留空，系統將自動計算課程中所有單元的總學時數。
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="price" className="mb-1">
                    課程價格
                  </Label>
                  <div className="flex">
                    <span
                      className="flex items-center justify-center border border-slate-200 rounded-l-md bg-slate-50 px-4 text-gray-700 text-lg"
                      style={{ height: 40 }}
                    >
                      $
                    </span>
                    <Input
                      id="price"
                      min="0"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                      className="rounded-l-none border-l-0 focus:ring-0 focus:border-slate-200"
                      style={{ height: 40 }}
                    />
                  </div>
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
                    {isLoading ? "建立中..." : "更新課程"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 右側：課程縮圖 */}
        <div className="md:w-4/12 w-full">
          <h2 className="text-xl font-bold mb-6">課程縮圖</h2>
          <div className="bg-white border border-blue-100 rounded-2xl">
            <div className="p-4">
              <Label className="block font-medium text-slate-800 mb-2">
                封面圖片
              </Label>
              <div
                {...getRootProps()}
                className={`
                  h-64 rounded-2xl border-2 border-dashed transition cursor-pointer flex flex-col items-center justify-center bg-slate-50
                  ${
                    fileRejections.length > 0
                      ? "border-red-400 bg-red-50"
                      : isDragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200"
                  }
                `}
                style={{ minHeight: 260 }}
              >
                <input {...getInputProps()} />
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="預覽圖片"
                    className="h-full max-h-56 max-w-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <ImagePlus size={40} className="text-slate-400 mb-2" />
                    <div className="font-bold text-lg text-slate-800 mb-1 text-center">
                      <p className="p-4">將圖片拖曳到此處或按一下以選擇圖片</p>
                    </div>
                  </div>
                )}
              </div>
              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => setPreviewUrl(null)}
                >
                  取消上傳
                </Button>
              )}
              {fileRejections.length > 0 && (
                <div className="text-red-500 text-sm mt-2">
                  檔案格式或大小不符，請選擇 2MB 以內的圖片檔案。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
