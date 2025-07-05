import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useCouponListStore } from "./couponListStore";
import { AiCouponGenerateRequest } from "./types";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScreenLoading } from "@/components/common/useScreenLoading";
import { useEffect, useState } from "react";

type FormData = {
  courseDescription: string;
  launchDate: string;
  numberOfPhases: number;
  discountType: "percentage" | "fixed";
  keywordThemes: string;
  phaseDurationDays: number;
};

const AICouponsGeneratorPage = () => {
  const navigate = useNavigate();
  const { generateAICoupons, isAiGenerating, clearAiGeneratedCoupons, clearEditableCouponDrafts } = useCouponListStore();
  const { toast } = useToast();
  const { showLoading, hideLoading } = useScreenLoading();
  
  // 使用 key 來強制重新渲染表單
  const [formKey, setFormKey] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      courseDescription: "",
      launchDate: "",
      numberOfPhases: 2,
      discountType: "percentage",
      keywordThemes: "",
      phaseDurationDays: 3
    }
  });

  // 頁面載入時清空表單並顯示載入畫面
  useEffect(() => {
    showLoading("載入中...");
    
    // 清除 store 中的狀態
    clearAiGeneratedCoupons();
    clearEditableCouponDrafts();
    
    // 強制重新渲染表單（這會讓表單使用 defaultValues 重新初始化）
    setFormKey(prev => prev + 1);
    
    // 延遲隱藏載入畫面
    const hideTimer = setTimeout(() => {
      hideLoading();
    }, 500);
    
    return () => {
      clearTimeout(hideTimer);
    };
  }, [clearAiGeneratedCoupons, clearEditableCouponDrafts, showLoading, hideLoading]); // 空依賴項，只在組件首次載入時執行

  const onSubmit = async (data: FormData) => {
    // 數據驗證
    if (!data.courseDescription?.trim()) {
      setError("courseDescription", { 
        type: "manual", 
        message: "請輸入課程描述" 
      });
      return;
    }

    if (data.courseDescription.trim().length < 8) {
      setError("courseDescription", { 
        type: "manual", 
        message: "課程描述至少需要 8 個字元" 
      });
      return;
    }

    if (!data.launchDate?.trim()) {
      setError("launchDate", { 
        type: "manual", 
        message: "請輸入上架日期" 
      });
      return;
    }

    // 確保日期格式正確
    let formattedLaunchDate = data.launchDate;
    
    // 如果是 8 位數格式，轉換為標準格式
    const eightDigitPattern = /^\d{8}$/;
    if (eightDigitPattern.test(data.launchDate)) {
      const year = data.launchDate.substring(0, 4);
      const month = data.launchDate.substring(4, 6);
      const day = data.launchDate.substring(6, 8);
      formattedLaunchDate = `${year}-${month}-${day}`;
    }

    // 驗證日期格式
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formattedLaunchDate)) {
      setError("launchDate", { 
        type: "manual", 
        message: "請使用正確的日期格式 (YYYY-MM-DD)" 
      });
      return;
    }

    // 驗證日期有效性
    const parsedDate = new Date(formattedLaunchDate);
    if (isNaN(parsedDate.getTime())) {
      setError("launchDate", { 
        type: "manual", 
        message: "請輸入有效的日期" 
      });
      return;
    }

    // 驗證數值欄位
    if (!data.numberOfPhases || data.numberOfPhases < 1 || data.numberOfPhases > 6) {
      setError("numberOfPhases", { 
        type: "manual", 
        message: "促銷方案數量必須介於 1-6 個之間" 
      });
      return;
    }

    if (!data.phaseDurationDays || data.phaseDurationDays < 1) {
      setError("phaseDurationDays", { 
        type: "manual", 
        message: "請輸入有效的持續天數（至少1天）" 
      });
      return;
    }

    const requestData: AiCouponGenerateRequest = {
      courseDescription: data.courseDescription.trim(),
      launchDate: formattedLaunchDate,
      numberOfPhases: Number(data.numberOfPhases),
      discountType: data.discountType,
      // 只在有值時才加入 optional 欄位
      ...(data.keywordThemes?.trim() && { keywordThemes: data.keywordThemes.trim() }),
      ...(data.phaseDurationDays && data.phaseDurationDays > 0 && { phaseDurationDays: Number(data.phaseDurationDays) })
    };

    try {
      const result = await generateAICoupons(requestData);
      
      if (result) {
        // AI 生成成功，先跳轉到審查頁面，不清空 AI 生成的數據
        navigate(ADMIN_ROUTES.AI_COUPONS_REVIEW);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI 生成失敗",
        description: error instanceof Error ? error.message : "發生錯誤",
      });
    }
  };

  // 清空表單函數
  const clearForm = () => {
    // 清除 store 中的狀態
    clearAiGeneratedCoupons();
    clearEditableCouponDrafts();
    
    // 強制重新渲染表單
    setFormKey(prev => prev + 1);
  };

  const handleCancel = () => {
    // 取消時清空表單並導航
    clearForm();
    navigate(ADMIN_ROUTES.COUPONS);
  };

  // 驗證日期格式是否符合後端期望
  const validateDateFormat = (value: string) => {
    if (!value) return;

    // 標準日期格式 YYYY-MM-DD (符合後端期望)
    const standardDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    
    // ISO 日期格式 YYYY-MM-DDTHH:mm:ss
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    
    // 8位數字格式 YYYYMMDD
    const eightDigitPattern = /^\d{8}$/;
    
    let dateToValidate: Date;
    
    // 檢查是否為 8 位數字格式，需要自動轉換
    if (eightDigitPattern.test(value)) {
      const year = value.substring(0, 4);
      const month = value.substring(4, 6);
      const day = value.substring(6, 8);
      const convertedDate = `${year}-${month}-${day}`;
      
      // 驗證轉換後的日期是否有效
      const date = new Date(convertedDate);
      if (isNaN(date.getTime()) || 
          date.getFullYear() !== parseInt(year) ||
          date.getMonth() + 1 !== parseInt(month) ||
          date.getDate() !== parseInt(day)) {
        setError('launchDate', {
          type: 'manual',
          message: '日期格式無效，請檢查日期是否正確'
        });
        return;
      } else {
        dateToValidate = date;
        // 自動轉換為標準格式
        setValue('launchDate', convertedDate, { shouldValidate: true });
      }
    } else if (standardDatePattern.test(value) || isoDatePattern.test(value)) {
      // 進一步驗證日期是否有效
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        setError('launchDate', {
          type: 'manual',
          message: '日期格式無效，請檢查日期是否正確'
        });
        return;
      } else {
        dateToValidate = date;
      }
    } else {
      // 如果不是標準格式，提醒用戶
      setError('launchDate', {
        type: 'manual',
        message: '建議使用標準日期格式 (YYYY-MM-DD)，例如：2025-07-13、20250713 或點擊日曆圖標選擇日期'
      });
      return;
    }

    // 檢查日期是否不小於今天
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 設定為今天的開始時間，避免時間比較問題
    
    if (dateToValidate < today) {
      const todayString = today.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
      
      setError('launchDate', {
        type: 'manual',
        message: `上架日期不能早於今天（${todayString}），請選擇今天或未來的日期`
      });
      return;
    }

    // 如果所有檢查都通過，清除錯誤
    clearErrors('launchDate');
  };


  return (
    <div className="py-4 md:py-8 w-full max-w-full overflow-hidden">
      <div className="md:container md:mx-auto md:px-6 lg:px-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-6 px-4 md:px-0">
          <h1 className="text-xl font-bold mb-2">
            智慧建立折扣碼計劃
          </h1>
          
          <p className="text-sm text-gray-600">
            幫助講師在課程正式上架前，快速設計一套多階段的折扣碼銷售策略，吸引不同時段的學生購買。
          </p>
        </div>

        {/* Main Form */}
        <div className="flex flex-col gap-0 md:flex-row md:gap-6 w-full max-w-full">
          {/* 左側：表單內容 */}
          <div className="flex-1 w-full max-w-full">
            <div className="bg-white md:rounded-lg border-0 md:border border-slate-200 w-full max-w-full">
              <div className="p-4 md:p-6 space-y-10 w-full max-w-full">
                <form key={formKey} id="ai-coupon-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  {/* 課程描述 */}
                  <div className="space-y-2 w-full max-w-full">
                    <label
                      htmlFor="courseDescription"
                      className="block text-sm font-medium text-gray-700"
                    >
                      請輸入課程描述... <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="courseDescription"
                      rows={4}
                      {...register("courseDescription", { 
                        required: "請輸入課程描述",
                        minLength: { value: 8, message: "課程描述至少需要 8 個字元" }
                      })}
                      className={`w-full max-w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 focus:shadow-none placeholder:text-gray-400 ${
                        errors.courseDescription ? "border-red-500" : ""
                      }`}
                      placeholder="請輸入課程描述..."
                      disabled={isAiGenerating}
                    />
                    {errors.courseDescription && (
                      <p className="text-sm text-red-500 break-words">{errors.courseDescription.message}</p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      幫助 AI 了解您的課程內容，以便產生更合適的折扣碼計劃。
                    </p>
                  </div>

                  {/* 課程預計何時上架 */}
                  <div className="space-y-2 w-full max-w-full">
                    <label
                      htmlFor="launchDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      你的課程預計何時上架？ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex gap-2">
                      <input
                        type="text"
                        id="launchDate"
                        {...register("launchDate", { 
                          required: "請輸入或選擇上架日期",
                        })}
                        className={`flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 focus:shadow-none placeholder:text-gray-400 ${
                          errors.launchDate ? "border-red-500" : ""
                        }`}
                        placeholder="建議輸入格式：2025-07-13 或 直接輸入 20250713"
                        disabled={isAiGenerating}
                        onBlur={(e) => validateDateFormat(e.target.value)}
                      />
                      <input
                        type="date"
                        className="absolute opacity-0 pointer-events-none"
                        onChange={(e) => {
                          if (e.target.value) {
                            setValue('launchDate', e.target.value, { shouldValidate: true });
                          }
                        }}
                        disabled={isAiGenerating}
                        id="hiddenDatePicker"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="px-3 flex-shrink-0"
                        onClick={() => {
                          const dateInput = document.getElementById('hiddenDatePicker') as HTMLInputElement;
                          if (dateInput && !isAiGenerating) {
                            dateInput.showPicker();
                          }
                        }}
                        disabled={isAiGenerating}
                        title="選擇日期"
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.launchDate && (
                      <p className="text-sm text-red-500 break-words">{errors.launchDate.message}</p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      建議使用標準格式 (YYYY-MM-DD，如：2025-07-13)，或點擊日曆圖標選擇日期。設定課程上架日期有助於 AI 規劃合適的促銷時程。
                    </p>
                  </div>

                  {/* 希望提供幾種促銷方案 */}
                  <div className="space-y-2 w-full max-w-full">
                    <label
                      htmlFor="numberOfPhases"
                      className="block text-sm font-medium text-gray-700"
                    >
                      希望提供幾種促銷方案？ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="numberOfPhases"
                      min="1"
                      max="6"
                      {...register("numberOfPhases", { 
                        required: "請輸入促銷方案數量",
                        min: { value: 1, message: "至少需要 1 種方案" },
                        max: { value: 6, message: "最多 6 種方案" }
                      })}
                      className={`w-full max-w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 focus:shadow-none placeholder:text-gray-400 ${
                        errors.numberOfPhases ? "border-red-500" : ""
                      }`}
                      placeholder="4"
                      disabled={isAiGenerating}
                    />
                    {errors.numberOfPhases && (
                      <p className="text-sm text-red-500 break-words">{errors.numberOfPhases.message}</p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      建議設定 2-4 種方案，創造階段性的促銷效果。最多可設定 6 種方案。
                    </p>
                  </div>

                  {/* 折扣類型 */}
                  <div className="space-y-2 w-full max-w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      希望以「百分比」或「固定金額」為主？ <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col space-y-3 md:flex-row md:gap-4 md:space-y-0 w-full max-w-full">
                      <label className="flex-1 border rounded-lg p-3 md:p-4 cursor-pointer flex items-start gap-2 transition w-full max-w-full border-slate-200 bg-white">
                        <input
                          type="radio"
                          value="percentage"
                          {...register("discountType")}
                          className="mt-1 accent-blue-500 flex-shrink-0"
                          disabled={isAiGenerating}
                        />
                        <div className="w-full max-w-full">
                          <div className="font-bold text-sm md:text-base">百分比</div>
                          <div className="text-xs md:text-sm text-gray-500 break-words">
                            適合價格較高的課程，例如：20% off
                          </div>
                        </div>
                      </label>
                      <label className="flex-1 border rounded-lg p-3 md:p-4 cursor-pointer flex items-start gap-2 transition w-full max-w-full border-slate-200 bg-white">
                        <input
                          type="radio"
                          value="fixed"
                          {...register("discountType")}
                          className="mt-1 accent-blue-500 flex-shrink-0"
                          disabled={isAiGenerating}
                        />
                        <div className="w-full max-w-full">
                          <div className="font-bold text-sm md:text-base">固定金額</div>
                          <div className="text-xs md:text-sm text-gray-500 break-words">
                            適合有明確預算的促銷，例如：現折 500 元
                          </div>
                        </div>
                      </label>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      選擇最適合您課程定價策略的折扣類型。
                    </p>
                  </div>

                  {/* 促銷關鍵風格 */}
                  <div className="space-y-2 w-full max-w-full">
                    <label
                      htmlFor="keywordThemes"
                      className="block text-sm font-medium text-gray-700"
                    >
                      有無想用的促銷關鍵風格（如「限時」、「早鳥」、「好友分享」）？
                    </label>
                    <input
                      type="text"
                      id="keywordThemes"
                      {...register("keywordThemes")}
                      className="w-full max-w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 focus:shadow-none placeholder:text-gray-400"
                      placeholder="例如：限時、早鳥、好友分享"
                      disabled={isAiGenerating}
                    />
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      輸入希望的促銷風格關鍵字，AI 會據此設計折扣碼名稱和策略。
                    </p>
                  </div>

                  {/* 折扣持續天數 */}
                  <div className="space-y-2 w-full max-w-full">
                    <label
                      htmlFor="phaseDurationDays"
                      className="block text-sm font-medium text-gray-700"
                    >
                      每個折扣希望持續幾天？ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="phaseDurationDays"
                      min="1"
                      {...register("phaseDurationDays", { 
                        required: "請輸入持續天數",
                        min: { value: 1, message: "至少需要 1 天" }
                      })}
                      className={`w-full max-w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 focus:shadow-none placeholder:text-gray-400 ${
                        errors.phaseDurationDays ? "border-red-500" : ""
                      }`}
                      placeholder="14"
                      disabled={isAiGenerating}
                    />
                    {errors.phaseDurationDays && (
                      <p className="text-sm text-red-500 break-words">{errors.phaseDurationDays.message}</p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 break-words">
                      建議設定 3-7 天，創造適度的急迫感又不會過於匆忙。
                    </p>
                  </div>

                  {/* 桌面版按鈕 - 只在桌面版顯示 */}
                  <div className="hidden md:flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isAiGenerating}
                    >
                      取消
                    </Button>
                    <Button
                      type="submit"
                      disabled={isAiGenerating}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {isAiGenerating ? "產生促銷折扣計劃中..." : "產生促銷折扣計劃"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* 手機版固定按鈕區 - 只在手機版顯示 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isAiGenerating}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              type="submit"
              form="ai-coupon-form"
              disabled={isAiGenerating}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isAiGenerating ? "產生中..." : "產生促銷計劃"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICouponsGeneratorPage;
