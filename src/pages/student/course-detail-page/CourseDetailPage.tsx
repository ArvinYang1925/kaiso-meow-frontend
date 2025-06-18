import { useParams } from "react-router-dom";
import { useCourseDetailStore } from "./courseDetailStore";
import HeroComponent from "./components/HeroComponent";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import FAQAccordion from "@/components/features/FAQAccordion";
import { CourseAccordion } from "./components/CourseAccordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../order-page/store/orderStore";
import { useDialogStore } from "@/stores/commonDialogStore";
import axios from "axios";
import DOMPurify from "dompurify";
import { useScreenLoading } from "@/components/common/useScreenLoading";

const CourseDetailPage = () => {
  const courseIntroRef = useRef<HTMLDivElement>(null);
  const chapterContentRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const { courseId } = useParams();
  const { courseDetail, fetchCourseDetailById } = useCourseDetailStore();
  const { withLoading, ScreenLoading } = useScreenLoading();

  const navigate = useNavigate();
  const { createOrderPreview } = useOrderStore();
  const { showCommonDialog } = useDialogStore();

  /** 淨化 html */
  const dirtyHTML = courseDetail?.description ?? "";
  const cleanHTML = DOMPurify.sanitize(dirtyHTML);

  useEffect(() => {
    if (!courseId) return;

    const loadInitialData = async () => {
      return withLoading(async () => {
        await fetchCourseDetailById(courseId);
      });
    };

    loadInitialData();
  }, [courseId, withLoading]);

  if (!courseDetail) return <div>載入中...</div>;

  /** Tab 所定位的頁面位置 */
  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref?.current) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  /** 產生訂單預覽 */
  const handleCreatePreviewOrder = async () => {
    const reqData = {
      courseId: courseId ?? "",
      couponId: "",
    };
    if (courseId !== "") {
      try {
        await createOrderPreview(reqData);
        navigate(`/order/${courseId}`);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          const { status, message } = error.response.data;
          showCommonDialog({
            title: status,
            description: message,
          });
        } else {
          // 非 Axios 的錯誤處理
          showCommonDialog({
            title: "Error",
            description: "Something went wrong. Please try again later.",
          });
        }
      }
    } else {
      showCommonDialog({
        title: "failed",
        description: "courseId 不可為空值！",
      });
    }
  };

  return (
    <>
      <div className="mt-16">
        <HeroComponent />
        <div className="container py-10 md:py-20 flex flex-col lg:flex-row gap-12">
          <div className="card-section order-1 lg:order-2 w-full lg:basis-1/3">
            <Card className="p-6 space-y-4">
              <img src={courseDetail?.coverUrl} className="rounded-lg" alt="" />
              <p className="price text-orange-500 font-medium text-2xl">
                NT$ {courseDetail.price.toLocaleString()}
              </p>
              <div className="text-base">
                <p>本課程包含以下內容</p>
                <ul className="text-slate-500 list-disc ps-4">
                  <li>課程長度約 {courseDetail.duration} 小時</li>
                </ul>
              </div>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-500"
                onClick={handleCreatePreviewOrder}
              >
                立即購買
              </Button>
            </Card>
          </div>

          <div className="text-section order-2 lg:order-1 w-full lg:basis-2/3 space-y-18">
            <Tabs
              defaultValue="courseIntro"
              className="w-full mb-18 text-sm border-b border-slate-200"
            >
              <TabsList>
                <TabsTrigger
                  value="courseIntro"
                  onClick={() => handleScroll(courseIntroRef)}
                  className="w-[88px] font-medium px-4 py-2 leading-[20px] data-[state=active]:border-b-2 data-[state=active]:border-black"
                >
                  課程簡介
                </TabsTrigger>
                <TabsTrigger
                  value="chapterContent"
                  onClick={() => handleScroll(chapterContentRef)}
                  className="w-[88px] font-medium px-4 py-2 leading-[20px] data-[state=active]:border-b-2 data-[state=active]:border-black"
                >
                  章節內容
                </TabsTrigger>
                <TabsTrigger
                  value="FAQSection"
                  onClick={() => handleScroll(faqRef)}
                  className="w-[88px] font-medium px-4 py-2 leading-[20px] data-[state=active]:border-b-2 data-[state=active]:border-black"
                >
                  常見問答
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div
              className="courseIntroSection scroll-mt-24"
              ref={courseIntroRef}
            >
              <h2 className="mb-10 font-medium text-3xl">課程簡介</h2>
              <div
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: cleanHTML }}
              />
               <h2 className="mb-10 font-medium text-3xl">課程亮點</h2>
              <div>
                {courseDetail.highlight.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
            <div
              className="chapterContentSection scroll-mt-24"
              ref={chapterContentRef}
            >
              <h2 className="mb-10 font-medium text-3xl">章節內容</h2>
              {courseDetail.sections.length > 0 ? (
                <CourseAccordion sections={courseDetail.sections} />
              ) : (
                <p>該課程目前尚無章節內容</p>
              )}
            </div>
            <div className="FAQSection scroll-mt-24" ref={faqRef}>
              <h2 className="mb-10 font-medium text-3xl">常見問答</h2>
              <FAQAccordion />
            </div>
          </div>
        </div>
      </div>
      <ScreenLoading />
    </>
  );
};

export default CourseDetailPage;
