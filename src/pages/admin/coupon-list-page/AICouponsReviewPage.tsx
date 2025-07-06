import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCouponListStore } from "./couponListStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/route-path";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";


// Zod Schema 驗證規則
const couponItemSchema = z.object({
  couponName: z
    .string({ message: "請填寫折扣碼名稱" })
    .min(1, { message: "折扣碼名稱不得為空" })
    .max(50, { message: "折扣碼名稱不得超過 50 字" }),
  type: z.enum(["fixed", "percentage"], { message: "折扣類型必須是 fixed 或 percentage" }),
  code: z
    .string({ message: "請填寫折扣碼代碼" })
    .min(1, { message: "折扣碼代碼不得為空" })
    .regex(/^[A-Z0-9_-]+$/, { message: "折扣碼只能包含大寫字母、數字、底線和連字號" }),
  value: z
    .number({ message: "請填寫折扣數值" })
    .positive({ message: "折扣數值必須為正數" }),
  startsAt: z
    .string({ message: "請填寫開始時間" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "開始時間格式錯誤，應為 YYYY-MM-DD" }),
  expiresAt: z
    .string({ message: "請填寫結束時間" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "結束時間格式錯誤，應為 YYYY-MM-DD" }),
})
.superRefine((data, ctx) => {
  // 只在結束日期有值時才檢查日期順序
  if (data.startsAt && data.expiresAt && data.startsAt.trim() !== "" && data.expiresAt.trim() !== "") {
    if (new Date(data.startsAt) > new Date(data.expiresAt)) {
      ctx.addIssue({
        path: ["startsAt"],
        code: z.ZodIssueCode.custom,
        message: "開始時間必須早於或等於結束時間",
      });
    }
  }
  
  // 百分比類型的折扣值檢查
  if (data.type === "percentage") {
    if (data.value < 1 || data.value > 99) {
      ctx.addIssue({
        path: ["value"],
        code: z.ZodIssueCode.custom,
        message: "percentage 類型的折扣值必須介於 1% 到 99% 之間",
      });
    }
  }
});

const formSchema = z
  .object({
    coupons: z.array(couponItemSchema).min(1, "請至少輸入一筆折扣碼"),
  })
  .superRefine((data, ctx) => {
    // 檢查折扣碼名稱重複
    const couponNames = data.coupons.map(c => c.couponName.trim().toLowerCase());
    
    const nameOccurrences = new Map<string, number[]>();
    couponNames.forEach((name, index) => {
      if (!nameOccurrences.has(name)) {
        nameOccurrences.set(name, []);
      }
      nameOccurrences.get(name)!.push(index);
    });

    nameOccurrences.forEach((indexes) => {
      if (indexes.length > 1) {
        indexes.forEach(index => {
          ctx.addIssue({
            path: ["coupons", index, "couponName"],
            code: z.ZodIssueCode.custom,
            message: `折扣碼名稱重複："${data.coupons[index].couponName}"`,
          });
        });
      }
    });

    // 檢查折扣碼重複
    const codes = data.coupons.map(c => c.code.trim().toUpperCase());
    
    const codeOccurrences = new Map<string, number[]>();
    codes.forEach((code, index) => {
      if (!codeOccurrences.has(code)) {
        codeOccurrences.set(code, []);
      }
      codeOccurrences.get(code)!.push(index);
    });

    codeOccurrences.forEach((indexes) => {
      if (indexes.length > 1) {
        indexes.forEach(index => {
          ctx.addIssue({
            path: ["coupons", index, "code"],
            code: z.ZodIssueCode.custom,
            message: `折扣碼重複："${data.coupons[index].code}"`,
          });
        });
      }
    });

    // 檢查時間衝突
    const sortedCoupons = data.coupons
      .map((coupon, index) => ({ ...coupon, originalIndex: index }))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

    for (let i = 0; i < sortedCoupons.length - 1; i++) {
      const current = sortedCoupons[i];
      const next = sortedCoupons[i + 1];
      
      const currentEnd = new Date(current.expiresAt);
      const nextStart = new Date(next.startsAt);
      
      if (currentEnd >= nextStart) {
        ctx.addIssue({
          path: ["coupons", next.originalIndex, "startsAt"],
          code: z.ZodIssueCode.custom,
          message: `促銷時間與方案 ${current.originalIndex + 1} 重疊`,
        });
      }
    }
  });

type CouponFormData = z.infer<typeof formSchema>;

const AICouponsReviewPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isBatchCreating,
    createBatchCoupons,
    aiGeneratedCoupons,
    selectedDiscountType,
    clearEditableCouponDrafts,
  } = useCouponListStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    register,
  } = useForm<CouponFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coupons: [],
    },
    mode: "onBlur", // 離開欄位時驗證
    reValidateMode: "onChange", // 重新驗證時即時觸發
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "coupons",
  });



  // 動態生成促銷策略說明
  const generatePromotionStrategy = () => {
    if (!aiGeneratedCoupons?.coupons || aiGeneratedCoupons.coupons.length === 0) {
      return "無法載入促銷策略資訊";
    }

    const coupons = aiGeneratedCoupons.coupons;
    
    // 當方案數量5個或以上時，優先使用 AI 的策略摘要
    if (coupons.length >= 5 && aiGeneratedCoupons.strategySummary) {
      return aiGeneratedCoupons.strategySummary;
    }

    // 當方案數量少於5個時，使用我們的詳細模板
    const discountUnit = selectedDiscountType === "percentage" ? "%" : "元";
    const discountPrefix = selectedDiscountType === "percentage" ? "" : "NT$";
    
    let strategy = "以下為根據課程特色時程自動產出的促銷方案與折扣碼清單，您可視情況進行調整。\n\n";

    coupons.forEach((coupon, index) => {
      const startDate = new Date(coupon.startsAt).toLocaleDateString('zh-TW');
      const couponNumber = index + 1;
      
      if (couponNumber === 1) {
        strategy += `🎯 超早鳥 ${discountPrefix}${coupon.value}${discountUnit} 優惠\n`;
        strategy += `⏰ 課程上架前 60 天（${startDate}）開始，為期兩週，提供固定金額 ${discountPrefix}${coupon.value}${discountUnit} 折扣。\n\n`;
      } else if (couponNumber === 2) {
        strategy += `🎯 早鳥 ${discountPrefix}${coupon.value}${discountUnit} 優惠\n`;
        strategy += `⏰ 接續超早鳥結束後開始，從 ${startDate} 起持續兩週，提供 ${discountPrefix}${coupon.value}${discountUnit} 折扣。\n\n`;
      } else if (couponNumber === 3) {
        // 簡化第3個方案，統一使用通用文案
        strategy += `🎯 程式設計專屬 ${discountPrefix}${coupon.value}${discountUnit} 優惠\n`;
        strategy += `⏰ 從 ${startDate} 開始兩週，提供 ${discountPrefix}${coupon.value}${discountUnit} 折扣，目標鎖定對程式開發有興趣的學習者，吸引進修與轉職族群，活化技術類課程流量。\n\n`;
      } else if (couponNumber === 4) {
        strategy += `🎯 上架當週限時 ${discountPrefix}${coupon.value}${discountUnit} 優惠\n`;
        strategy += `⏰ 於 ${startDate} 課程正式上架當週啟動，提供 ${discountPrefix}${coupon.value}${discountUnit} 折扣。\n\n`;
      } else {
        // 第5個方案以後，使用通用模板
        strategy += `🎯 ${coupon.couponName} ${discountPrefix}${coupon.value}${discountUnit} 優惠\n`;
        strategy += `⏰ 從 ${startDate} 開始，提供 ${discountPrefix}${coupon.value}${discountUnit} 折扣。\n\n`;
      }
    });

    strategy += "各方案時間不重疊，遞進推進，強化轉換率與行銷節奏。";
    return strategy;
  };

  // 組件載入時，從AI生成的結果初始化表單
  useEffect(() => {
    if (aiGeneratedCoupons && aiGeneratedCoupons.coupons && aiGeneratedCoupons.coupons.length > 0) {
      const formattedCoupons = aiGeneratedCoupons.coupons.map(coupon => ({
        couponName: coupon.couponName || "",
        type: coupon.type || selectedDiscountType || "fixed", // 優先使用 AI 回傳的類型，再用儲存的類型作為後備
        code: coupon.code || "",
        value: coupon.value || 0,
        startsAt: coupon.startsAt ? coupon.startsAt.split('T')[0] : "", // 確保是 YYYY-MM-DD 格式
        expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : "", // 確保是 YYYY-MM-DD 格式
      }));
      setValue("coupons", formattedCoupons);
    } else {
      // 如果沒有AI生成的數據，導航回產生器頁面
      navigate(ADMIN_ROUTES.AI_COUPONS_GENERATOR);
    }
  }, [aiGeneratedCoupons, selectedDiscountType, setValue, navigate]);

  // Zod schema 已處理所有驗證邏輯，無需手動驗證函數

  // 處理批量提交
  const onSubmit = async (data: CouponFormData) => {
    try {
      // 確保數據格式正確
      const formattedCoupons = data.coupons.map((coupon) => {
        const formatted = {
          couponName: coupon.couponName.trim(),
          type: coupon.type,
          code: coupon.code.trim().toUpperCase(),
          value: Number(coupon.value),
          startsAt: coupon.startsAt,
          expiresAt: coupon.expiresAt,
        };
        return formatted;
      });

      try {
        const result = await createBatchCoupons({
          coupons: formattedCoupons,
        });

        if (result) {
          clearEditableCouponDrafts();
          navigate(ADMIN_ROUTES.COUPONS);
        }
      } catch (submitError) {
        // 如果是 409 錯誤，自動調整折扣碼並重新提交
        if (submitError instanceof AxiosError && submitError.response?.status === 409) {
          // 自動調整重複的折扣碼
          const adjustedCoupons = autoFixDuplicateCodes(formattedCoupons);

          try {
            const retryResult = await createBatchCoupons({
              coupons: adjustedCoupons,
            });

            if (retryResult) {
              clearEditableCouponDrafts();
              navigate(ADMIN_ROUTES.COUPONS);
            }
          } catch (retryError) {
            toast({
              variant: "destructive",
              title: "自動調整後仍然失敗",
              description: retryError instanceof Error ? retryError.message : "自動調整折扣碼失敗，請手動修改後重試。",
            });
            throw retryError;
          }
        } else {
          throw submitError;
        }
      }
    } catch (error) {
      // 只使用 API 回傳的錯誤訊息
      toast({
        variant: "destructive",
        title: "批量創建折扣碼失敗",
        description: error instanceof Error ? error.message : "發生未知錯誤，請稍後再試",
      });
    }
  };

  // 處理取消操作
  const handleCancel = () => {
    clearEditableCouponDrafts();
    navigate(ADMIN_ROUTES.AI_COUPONS_GENERATOR);
  };

  // 自動調整重複的折扣碼
  const autoFixDuplicateCodes = (formattedCoupons: { couponName: string; type: "fixed" | "percentage"; code: string; value: number; startsAt: string; expiresAt: string; }[]) => {
    const timestamp = Date.now();
    return formattedCoupons.map((coupon, index) => ({
      ...coupon,
      code: `${coupon.code}_${timestamp}_${index + 1}`, // 使用時間戳加序號確保唯一性
      couponName: `${coupon.couponName}_${index + 1}`, // 名稱也加上序號
    }));
  };

  // 新增折扣碼
  const addNewCoupon = () => {
    const newCoupon = {
      couponName: "",
      type: (selectedDiscountType || "fixed") as "fixed" | "percentage",
      code: "",
      value: 0,
      startsAt: "",
      expiresAt: "",
    };
    append(newCoupon);
  };

  // 獲取折扣單位
  const getDiscountUnit = () => {
    return selectedDiscountType === "percentage" ? "%" : "元";
  };

  // 獲取折扣欄位標籤
  const getDiscountLabel = () => {
    return selectedDiscountType === "percentage" ? "折扣百分比" : "折扣金額";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            促銷策略說明與折扣碼審查
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            檢視AI產生的促銷計劃，確認或調整折扣碼設定
          </p>
        </div>

        {/* 促銷策略說明區域 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            促銷策略說明
          </h2>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line" style={{ textIndent: '0', paddingLeft: '0' }}>
              {generatePromotionStrategy().split('\n').map((line, index) => {
                if (line.trim() === '') {
                  return <div key={index} className="h-4"></div>;
                }
                
                // 檢查是否以 emoji 開頭並正確分離 emoji 和文字
                const emojiMatch = line.trim().match(/^([🎯⏰])\s*(.*)$/u);
                
                if (emojiMatch) {
                  const emoji = emojiMatch[1];
                  const text = emojiMatch[2];
                  return (
                    <div key={index} className="flex items-start mb-1">
                      <span className="mr-2 flex-shrink-0">{emoji}</span>
                      <span className="flex-1">{text}</span>
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="mb-1">
                      {line}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 折扣碼方案列表 */}
          <div className="space-y-6">
            {/* 新增折扣碼按鈕 */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                折扣碼方案（共 {fields.length} 個）
              </h3>
              <Button
                type="button"
                onClick={addNewCoupon}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 text-sm"
              >
                新增折扣碼
              </Button>
            </div>

            {/* 折扣碼方案卡片列表 */}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm"
              >
                {/* 刪除按鈕 */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition-colors"
                  aria-label="刪除方案"
                >
                  刪除
                </button>

                {/* 方案標題 */}
                <div className="mb-4">
                  <h4 className="text-base font-semibold text-gray-900 mb-2">
                    方案 {index + 1}
                  </h4>
                </div>

                {/* 隱藏的 type 欄位 */}
                <input
                  type="hidden"
                  {...register(`coupons.${index}.type`)}
                />

                {/* 表單欄位網格 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* 折扣碼名稱 */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      折扣碼名稱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register(`coupons.${index}.couponName`)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.coupons?.[index]?.couponName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="請輸入折扣碼名稱"
                    />
                    {errors.coupons?.[index]?.couponName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.coupons[index].couponName?.message}
                      </p>
                    )}
                    {!errors.coupons?.[index]?.couponName && (
                      <p className="text-gray-500 text-xs mt-1">
                        名稱不可重複，最多50字
                      </p>
                    )}
                  </div>

                  {/* 折扣碼 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      折扣碼 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register(`coupons.${index}.code`, {
                        onChange: (e) => {
                          e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
                        }
                      })}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.coupons?.[index]?.code ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="請輸入折扣碼（例如：EARLY2025）"
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.coupons?.[index]?.code && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.coupons[index].code?.message}
                      </p>
                    )}
                    {!errors.coupons?.[index]?.code && (
                      <p className="text-gray-500 text-xs mt-1">
                        只能包含大寫字母、數字、底線(_)和連字號(-)
                      </p>
                    )}
                  </div>

                  {/* 折扣金額/百分比 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getDiscountLabel()} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max={selectedDiscountType === "percentage" ? "100" : undefined}
                        {...register(`coupons.${index}.value`, {
                          valueAsNumber: true
                        })}
                        className={`w-full border rounded-lg px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.coupons?.[index]?.value ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        {getDiscountUnit()}
                      </span>
                    </div>
                    {errors.coupons?.[index]?.value && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.coupons[index].value?.message}
                      </p>
                    )}
                    {!errors.coupons?.[index]?.value && selectedDiscountType === "percentage" && (
                      <p className="text-gray-500 text-xs mt-1">
                        百分比範圍：1% - 99%
                      </p>
                    )}
                  </div>

                  {/* 開始日期 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      開始日期 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        {...register(`coupons.${index}.startsAt`)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.coupons?.[index]?.startsAt ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.coupons?.[index]?.startsAt && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.coupons[index].startsAt?.message}
                      </p>
                    )}
                    {!errors.coupons?.[index]?.startsAt && (
                      <p className="text-gray-500 text-xs mt-1">
                        請確保時間不與其他方案重疊
                      </p>
                    )}
                  </div>

                  {/* 結束日期 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      結束日期 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        {...register(`coupons.${index}.expiresAt`)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.coupons?.[index]?.expiresAt ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.coupons?.[index]?.expiresAt && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.coupons[index].expiresAt?.message}
                      </p>
                    )}
                    {!errors.coupons?.[index]?.expiresAt && (
                      <p className="text-gray-500 text-xs mt-1">
                        結束日期必須晚於開始日期
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* 如果沒有方案顯示提示 */}
            {fields.length === 0 && (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                <p className="text-gray-500 text-sm sm:text-base mb-4">
                  目前沒有折扣碼方案
                </p>
                <Button
                  type="button"
                  onClick={addNewCoupon}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 text-sm"
                >
                  新增第一個折扣碼
                </Button>
              </div>
            )}

            {/* 整體表單錯誤訊息 */}
            {errors.coupons && !Array.isArray(errors.coupons) && errors.coupons.message && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-600 text-sm">
                  {errors.coupons.message}
                </p>
              </div>
            )}
          </div>

          {/* 底部操作按鈕 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {/* 桌面版按鈕 */}
            <div className="hidden sm:flex justify-end space-x-4">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="px-6 py-2 text-sm"
                disabled={isBatchCreating}
              >
                取消
              </Button>
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 text-sm"
                disabled={isBatchCreating || fields.length === 0}
              >
                {isBatchCreating ? "處理中..." : "完成並送出"}
              </Button>
            </div>

            {/* 手機版按鈕 */}
            <div className="sm:hidden space-y-3">
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-sm"
                disabled={isBatchCreating || fields.length === 0}
              >
                {isBatchCreating ? "處理中..." : "完成並送出"}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="w-full py-3 text-sm"
                disabled={isBatchCreating}
              >
                取消
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AICouponsReviewPage; 