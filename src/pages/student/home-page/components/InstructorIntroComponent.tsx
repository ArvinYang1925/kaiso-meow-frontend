import { FC } from "react";
import { instructorIntroData } from "@/pages/student/home-page/data/instructorIntroData";

const InstructorIntroComponent: FC = () => {
  return (
    <section className="py-16 relative overflow-hidden mb-32">
      <div className="container mx-auto mt-[90px] w-full px-0">
        <div className="text-center mb-24">
          <h3 className="text-2xl font-bold mb-4">關於你的老師</h3>
          <div className="w-12 h-1 bg-black mx-auto"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {instructorIntroData.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-8 w-full"
            >
              {/* 左邊：文字介紹（手機版在下方，電腦版在左） */}
              <div
                className="bg-white p-6 md:p-12 rounded-lg border border-orange-200 w-full md:w-[505px] md:mx-0 shadow-lg"
                style={{ boxShadow: "0px 16px 32px 0px #EA580C1A" }}
              >
                <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                {item.description.split('\n').map((line, lineIdx) => (
                  <p key={`${idx}-${lineIdx}`} className="text-paragraph font-normal mb-2">{line}</p>
                ))}
              </div>
              {/* 右邊：圖片（手機版在上方，電腦版在右） */}
              <div className="w-full flex justify-center md:w-[727px] md:justify-end">
                <img
                  src={item.imageSrc}
                  alt="老師"
                  className="h-auto max-w-[300px] md:max-w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorIntroComponent;
