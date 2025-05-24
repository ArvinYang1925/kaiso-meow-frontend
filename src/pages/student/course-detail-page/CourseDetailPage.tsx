// import { useParams } from "react-router-dom";
import { useCourseDetailStore } from "./courseDetailStore";
import React from "@/assets/homepage/react-course-card.jpg";
import HeroComponent from "./components/HeroComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useRef } from "react";
import { FAQAccordion } from "@/components/common/FAQAccordion";

const CourseDetailPage = () => {
  const courseIntroRef = useRef(null);
  const chapterContentRef = useRef(null);
  const faqRef = useRef(null);

  //   const { courseId } = useParams();
  const { courseDetail } = useCourseDetailStore();

  if (!courseDetail) return <div>載入中...</div>;

  const handleScroll = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mt-16">
      <HeroComponent />
      <div className="container py-20 grid grid-cols-2 gap-12">
        <div className="wrapper">
          <div className="text-section space-y-18">
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
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos eum
                repellendus molestiae maiores veniam corporis delectus similique
                fugiat perspiciatis adipisci reprehenderit rem sunt nisi fuga
                quae repellat tempore, minima aut! Modi obcaecati sunt et Lorem
                ipsum dolor sit amet consectetur adipisicing elit. Eos eum
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
            <div className="FAQSection scroll-mt-24" ref={faqRef}>
              <h2 className="mb-10 font-medium text-3xl">常見問答</h2>
              <p>
                <FAQAccordion />
              </p>
            </div>
          </div>
        </div>
        <div className="card-section">
          <Card>dddd</Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
