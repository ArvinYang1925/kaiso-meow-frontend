import { useParams } from "react-router-dom";
import { useCourseDetailStore } from "./courseDetailStore";
import React from "@/assets/homepage/react-course-card.jpg";
import HeroComponent from "./components/HeroComponent";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useRef } from "react";
import { FAQAccordion } from "@/components/common/FAQAccordion";
import { CourseAccordion } from "./components/CourseAccordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CourseDetailPage = () => {
  const courseIntroRef = useRef(null);
  const chapterContentRef = useRef(null);
  const faqRef = useRef(null);

  const { courseId } = useParams();
  const { courseDetail } = useCourseDetailStore();

  const navigate = useNavigate();

  if (!courseDetail) return <div>載入中...</div>;

  const handleScroll = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mt-16">
      <HeroComponent />
      <div className="container py-20 flex gap-12">
        <div className="text-section basis-2/3 space-y-18">
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
          <div className="courseIntroSection scroll-mt-24" ref={courseIntroRef}>
            <h2 className="mb-10 font-medium text-3xl">課程簡介</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos eum
              repellendus molestiae maiores veniam corporis delectus similique
              fugiat perspiciatis adipisci reprehenderit rem sunt nisi fuga
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos eum
              repellendus molestiae maiores veniam corporis delectus similique
              fugiat perspiciatis adipisci reprehenderit rem sunt nisi fuga
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos eum
              repellendus molestiae maiores veniam corporis delectus similique
              fugiat perspiciatis adipisci reprehenderit rem sunt nisi fuga
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos eum
              repellendus molestiae maiores veniam corporis delectus similique
              fugiat perspiciatis adipisci reprehenderit rem sunt nisi fuga
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos eum
              repellendus molestiae maiores veniam corporis delectus similique
              fugiat perspiciatis adipisci reprehenderit rem sunt nisi fuga
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos eum
              repellendus molestiae maiores veniam corporis delectus similique
              fugiat perspiciatis adipisci reprehenderit rem sunt nisi fuga
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos eum
              repellendus molestiae maiores veniam corporis delectus similique
              fugiat perspiciatis adipisci reprehenderit rem sunt nisi fuga
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos eum
              repellendus molestiae maiores veniam corporis delectus similique
              fugiat perspiciatis adipisci reprehenderit rem sunt nisi fuga
            </p>
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
            <p>
              <FAQAccordion />
            </p>
          </div>
        </div>

        <div className="card-section basis-1/3">
          <Card className="p-6 space-y-4">
            <img src={React} className="rounded-lg" alt="" />
            <p className="price text-orange-500 font-medium text-2xl">
              NT$ {courseDetail.price.toLocaleString()}
            </p>
            <div className="text-base">
              <p>本課程包含以下內容</p>
              <ul className="text-slate-500 list-disc ps-4">
                <li>課程長度約 {courseDetail.duration} 小時</li>
              </ul>
            </div>
            <Button className="w-full bg-orange-600 hover:bg-orange-500" onClick={()=>navigate(`/order/${courseId}`)}>
              立即購買
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
