import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// 引入收益管理模組
import { useRevenueStore } from "./dashboardStore";
import {
  formatCurrency,
  formatDateForAPI,
  formatNumber,
  formatGrowthRate,
} from "./dashboard.service";
import {
  INTERVAL_OPTIONS,
  CHART_COLORS,
  IntervalType,
  CourseOptionModel,
} from "./dashboard.model";
import { useScreenLoading } from "@/components/common/useScreenLoading";
import colors from "tailwindcss/colors";

// =============================================================================
// 圖表配置與常數
// =============================================================================

// 圖表配置型別
type DynamicChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

const chartConfig = {
  revenue: {
    label: "收益",
    color: CHART_COLORS.sky400,
  },
  orders: {
    label: "訂單數",
    color: CHART_COLORS.primary,
  },
} satisfies DynamicChartConfig;

// 課程分佈顏色 - 使用 blue 漸進色系
const PIE_COLORS = [
  colors.blue[50],
  colors.blue[100],
  colors.blue[200],
  colors.blue[300],
  colors.blue[400],
  colors.blue[500],
  colors.blue[600],
  colors.blue[700],
  colors.blue[800],
  colors.blue[900],
  colors.blue[950],
];

// 生成課程圖表配置
const generateCourseChartConfig = (
  courseOptions: CourseOptionModel[]
): DynamicChartConfig => {
  const config: DynamicChartConfig = { ...chartConfig };

  // 將課程資料加入配置
  courseOptions.forEach((course, index) => {
    config[course.id] = {
      label: course.title,
      color: PIE_COLORS[index % PIE_COLORS.length],
    };
  });

  // 加入其他課程選項
  config["others"] = {
    label: "其他課程",
    color: PIE_COLORS[PIE_COLORS.length - 1],
  };

  return config;
};

// =============================================================================
// 工具函數
// =============================================================================
const formatDate = (date: Date): string => {
  return formatDateForAPI(date);
};

const getIntervalDisplayName = (interval: IntervalType): string => {
  const map = {
    day: "日",
    week: "週",
    month: "月",
    year: "年",
  };
  return map[interval] || interval;
};

// 統計卡片組件
const StatCard = ({
  title,
  value,
  growth,
  isPositive,
  icon: Icon,
  subtitle,
  badge,
}: {
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  icon: React.ElementType;
  subtitle?: string;
  badge?: string;
}) => (
  <Card className="h-full">
    <CardContent className="p-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-600">
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{title}</span>
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{value}</div>
          <div
            className={`flex items-center text-sm ${
              isPositive ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {growth}
          </div>
        </div>
        {subtitle && <div className="text-slate-600 text-sm">{subtitle}</div>}
      </div>
    </CardContent>
  </Card>
);

// 篩選表單組件
const FilterForm = ({
  startDate,
  endDate,
  interval,
  courseId,
  courseOptions,
  isLoadingCourses,
  isLoading,
  onStartDateChange,
  onEndDateChange,
  onIntervalChange,
  onCourseChange,
  onApply,
  onReset,
}: {
  startDate: string;
  endDate: string;
  interval: IntervalType;
  courseId: string;
  courseOptions: Array<{ id: string; title: string }>;
  isLoadingCourses: boolean;
  isLoading: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onIntervalChange: (value: IntervalType) => void;
  onCourseChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}) => {
  const isFormValid = useMemo(
    () => startDate && endDate && new Date(startDate) <= new Date(endDate),
    [startDate, endDate]
  );

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          資料篩選
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">開始時間</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">結束時間</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">時間間隔</Label>
              <Select value={interval} onValueChange={onIntervalChange}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="選擇間隔" />
                </SelectTrigger>
                <SelectContent>
                  {INTERVAL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">課程篩選</Label>
              <Select
                value={courseId}
                onValueChange={onCourseChange}
                disabled={isLoadingCourses}
              >
                <SelectTrigger className="h-11">
                  <SelectValue
                    placeholder={
                      isLoadingCourses ? "載入課程中..." : "選擇課程（可選）"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部課程</SelectItem>
                  {courseOptions.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                  {courseOptions.length === 0 && !isLoadingCourses && (
                    <SelectItem value="no-courses" disabled>
                      暫無課程資料
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium opacity-0">操作</Label>
              <div className="flex gap-2">
                <Button
                  onClick={onApply}
                  disabled={isLoading || !isFormValid}
                  className="flex-1 h-11"
                >
                  {isLoading ? "載入中..." : "查詢"}
                </Button>
                <Button
                  variant="outline"
                  onClick={onReset}
                  disabled={isLoading}
                  className="h-11 px-3"
                >
                  重置
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 頁面標題組件
const PageHeader = ({
  lastUpdated,
  isRefreshing,
  onRefresh,
}: {
  lastUpdated?: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-2">收益數據儀表板</h2>
        <p className="text-gray-600">追蹤您的課程收益和銷售表現</p>
      </div>
      <div className="flex items-center gap-3">
        {lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>最後更新: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "更新中..." : "刷新"}
        </Button>
      </div>
    </div>
  </div>
);

// 空狀態組件
const EmptyState = ({
  onRetry,
  isLoading,
}: {
  onRetry: () => void;
  isLoading: boolean;
}) => (
  <Card isLoading={isLoading}>
    <CardContent className="pt-6">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Activity className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">暫無數據</h3>
        <p className="text-gray-600 mb-4">請調整篩選條件後重新查詢</p>
        <Button onClick={onRetry} disabled={isLoading}>
          重新查詢
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { ScreenLoading, withLoading } = useScreenLoading();

  const {
    revenueData,
    courseOptions,
    filter,
    isLoading,
    isLoadingCourseOptions,
    isRefreshing,
    hasInitialized,
    updateState,
    initialize,
    setDateRange,
    setInterval,
    setCourseFilter,
    refreshAllData,
    resetFilter,
    getStatistics,
    fetchRevenueReport,
    fetchCourseOptions,
  } = useRevenueStore();

  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  const [localFilters, setLocalFilters] = useState({
    startDate: formatDate(filter.startDate),
    endDate: formatDate(filter.endDate),
    courseId: filter.selectedCourseId || "all",
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await withLoading(async () => {
          if (!hasInitialized) {
            await initialize();
          } else if (courseOptions.length === 0) {
            await fetchCourseOptions();
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeDashboard();
  }, [
    hasInitialized,
    initialize,
    withLoading,
    courseOptions.length,
    fetchCourseOptions,
  ]);

  useEffect(() => {
    if (!isInitialLoading) {
      setLocalFilters({
        startDate: formatDate(filter.startDate),
        endDate: formatDate(filter.endDate),
        courseId: filter.selectedCourseId || "all",
      });
    }
  }, [filter, isInitialLoading]);

  const handleApplyFilters = useCallback(async () => {
    const start = new Date(localFilters.startDate);
    const end = new Date(localFilters.endDate);

    if (start > end) return;

    setDateRange(start, end);
    setCourseFilter(
      localFilters.courseId === "all" ? undefined : localFilters.courseId
    );
    await fetchRevenueReport(true);
  }, [localFilters, setDateRange, setCourseFilter, fetchRevenueReport]);

  const handleIntervalChange = useCallback(
    (newInterval: IntervalType) => {
      setInterval(newInterval);
    },
    [setInterval]
  );

  const handleReset = useCallback(() => {
    resetFilter();
  }, [resetFilter]);

  const updateLocalFilter = useCallback(
    (key: keyof typeof localFilters, value: string) => {
      setLocalFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const statistics = useMemo(() => getStatistics(), [getStatistics]);

  const growthMetrics = useMemo(
    () => ({
      revenueGrowth: formatGrowthRate(statistics.revenueGrowthRate),
      revenueGrowthPositive: statistics.revenueGrowthRate >= 0,
      ordersGrowth: formatGrowthRate(statistics.ordersGrowthRate),
      ordersGrowthPositive: statistics.ordersGrowthRate >= 0,
      avgGrowth: formatGrowthRate(
        statistics.revenueGrowthRate - statistics.ordersGrowthRate
      ),
      avgGrowthPositive:
        statistics.revenueGrowthRate - statistics.ordersGrowthRate >= 0,
    }),
    [statistics]
  );

  const processedChartData = useMemo(() => {
    if (!revenueData?.revenueData) return [];

    return revenueData.revenueData.map((item) => {
      const date = new Date(item.intervalStart);
      const formattedDate = new Intl.DateTimeFormat("zh-TW", {
        month: "2-digit",
        day: "2-digit",
      }).format(date);

      return {
        date: formattedDate,
        revenue:
          typeof item.totalRevenue === "number"
            ? item.totalRevenue
            : Number(item.totalRevenue) || 0,
        orders:
          typeof item.orderCount === "number"
            ? item.orderCount
            : Number(item.orderCount) || 0,
      };
    });
  }, [revenueData]);

  // 圓餅圖-課程分佈數據處理
  const courseDistributionData = useMemo(() => {
    if (!courseOptions || courseOptions.length === 0) {
      return [];
    }

    // 取前 9 個課程
    const topCourses = courseOptions.slice(0, 9);
    const otherCoursesCount = Math.max(0, courseOptions.length - 9);

    // 生成分佈數據
    const distribution = [
      ...topCourses.map((course) => ({
        name: course.title,
        value: Math.floor(
          100 / (courseOptions.length + (otherCoursesCount ? 1 : 0))
        ),
      })),
    ];

    // 如果有其他課程，加入其他課程選項
    if (otherCoursesCount > 0) {
      distribution.push({
        name: "其他課程",
        value: Math.floor(100 / (courseOptions.length + 1)) * otherCoursesCount,
      });
    }

    // 確保總和為 100
    const currentSum = distribution.reduce((sum, item) => sum + item.value, 0);
    if (currentSum < 100 && distribution.length > 0) {
      distribution[0].value += 100 - currentSum;
    }

    return distribution;
  }, [courseOptions]);

  if (isInitialLoading) {
    return <ScreenLoading />;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <PageHeader
            lastUpdated={updateState.lastUpdated ?? undefined}
            isRefreshing={isRefreshing}
            onRefresh={refreshAllData}
          />

          <FilterForm
            startDate={localFilters.startDate}
            endDate={localFilters.endDate}
            interval={filter.interval}
            courseId={localFilters.courseId}
            courseOptions={courseOptions}
            isLoadingCourses={isLoadingCourseOptions}
            isLoading={isLoading}
            onStartDateChange={(value) => updateLocalFilter("startDate", value)}
            onEndDateChange={(value) => updateLocalFilter("endDate", value)}
            onIntervalChange={handleIntervalChange}
            onCourseChange={(value) => updateLocalFilter("courseId", value)}
            onApply={handleApplyFilters}
            onReset={handleReset}
          />

          {/* 數據內容 */}
          {revenueData ? (
            <>
              {/* 統計卡片區域 */}
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                {/* 總收益卡片 */}
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardContent className="p-6 h-full">
                      <div className="flex flex-col justify-center h-full space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-slate-600">
                            <DollarSign className="h-5 w-5" />
                            <span className="text-sm font-medium">
                              線上課程收益總額
                            </span>
                          </div>
                          <Badge variant="secondary">
                            {getIntervalDisplayName(filter.interval)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-4xl font-bold">
                            {formatNumber(
                              Math.round(
                                revenueData.summary.totalRevenue / 1000
                              )
                            )}
                            K
                          </div>
                          <div
                            className={`flex items-center text-sm font-medium ${
                              growthMetrics.revenueGrowthPositive
                                ? "text-red-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {growthMetrics.revenueGrowthPositive ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {growthMetrics.revenueGrowth}
                          </div>
                        </div>
                        <div className="text-slate-600 text-sm">
                          {formatCurrency(revenueData.summary.totalRevenue)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 訂單數和平均值 */}
                <div className="lg:col-span-2 grid grid-cols-1 gap-4">
                  <StatCard
                    title="累計訂單紀錄"
                    value={formatNumber(revenueData.summary.totalOrders)}
                    growth={growthMetrics.ordersGrowth}
                    isPositive={growthMetrics.ordersGrowthPositive}
                    icon={ShoppingCart}
                  />
                  <StatCard
                    title="平均訂單價值"
                    value={`${formatNumber(
                      Math.round(revenueData.summary.averageOrderValue / 1000)
                    )}K`}
                    growth={growthMetrics.avgGrowth}
                    isPositive={growthMetrics.avgGrowthPositive}
                    icon={TrendingUp}
                    subtitle={formatCurrency(
                      revenueData.summary.averageOrderValue
                    )}
                  />
                </div>

                {/* 課程收益分佈圓餅圖 */}
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardHeader className="items-center pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <PieChartIcon className="h-4 w-4" />
                        課程收益分佈
                      </CardTitle>
                      <CardDescription>單位：%</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ChartContainer
                        config={generateCourseChartConfig(courseOptions)}
                        className="mx-auto aspect-square h-[180px]"
                      >
                        <PieChart>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={courseDistributionData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                          >
                            {courseDistributionData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 圖表分析區域 */}
              <div className="space-y-6">
                {/* 收益趨勢面積圖 */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          收益趨勢分析
                        </CardTitle>
                        <CardDescription>
                          {localFilters.startDate} 至 {localFilters.endDate} •
                          按{getIntervalDisplayName(filter.interval)}統計
                        </CardDescription>
                      </div>
                      <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                          growthMetrics.revenueGrowthPositive
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        收益
                        {growthMetrics.revenueGrowthPositive
                          ? "上升"
                          : "下降"}{" "}
                        {growthMetrics.revenueGrowth}
                        {growthMetrics.revenueGrowthPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={processedChartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient
                              id="revenueGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor={CHART_COLORS.sky400}
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor={CHART_COLORS.sky400}
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-gray-200"
                          />
                          <XAxis
                            dataKey="date"
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => {
                              const numValue = Number(value);
                              return isNaN(numValue)
                                ? "0"
                                : `${Math.round(numValue / 1000)}K`;
                            }}
                          />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-3 border rounded-lg shadow-lg border-sky-200">
                                    <p className="font-medium text-gray-800 mb-1">
                                      日期: {label}
                                    </p>
                                    <p className="text-sky-600">
                                      收益:{" "}
                                      {formatCurrency(Number(payload[0].value))}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            name="收益"
                            stroke={CHART_COLORS.sky400}
                            fillOpacity={1}
                            fill="url(#revenueGradient)"
                            strokeWidth={2}
                            dot={{ r: 4, fill: CHART_COLORS.sky400 }}
                            activeDot={{ r: 6, fill: CHART_COLORS.sky400 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* 訂單數量柱狀圖 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      訂單數量分析
                    </CardTitle>
                    <CardDescription>
                      每{getIntervalDisplayName(filter.interval)}的訂單統計
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={processedChartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-gray-200"
                          />
                          <XAxis
                            dataKey="date"
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-3 border rounded-lg shadow-lg border-sky-200">
                                    <p className="font-medium text-gray-800 mb-1">
                                      日期: {label}
                                    </p>
                                    <p className="text-sky-600">
                                      訂單:{" "}
                                      {formatNumber(Number(payload[0].value))}{" "}
                                      筆
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar
                            dataKey="orders"
                            fill={CHART_COLORS.sky400}
                            stroke={CHART_COLORS.sky500}
                            strokeWidth={1}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            !isLoading && (
              <EmptyState onRetry={handleApplyFilters} isLoading={isLoading} />
            )
          )}
        </div>
      </div>
      <ScreenLoading />
    </>
  );
}
