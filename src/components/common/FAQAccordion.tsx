import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** FAQ 內容比較客制化排版，獨立製作一個元件 */
export const FAQAccordion = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>課程是即時直播還是預錄影片？</AccordionTrigger>
        <AccordionContent>
          <p>
            本課程採用 <span className="font-bold">預錄影片</span>
            ，你可以
          </p>
          <p>
            <span className="font-bold">隨時隨地學習</span>
            ，按照自己的節奏進行，不受時間限制。
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>購買課程後，可以無限次觀看嗎？</AccordionTrigger>
        <AccordionContent>
          是的！購買後你可以 <span className="font-bold">無限次觀看</span>
          ，不限時間和次數，隨時複習內容，確保學會為止。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>上課期間可以提問嗎？</AccordionTrigger>
        <AccordionContent>
          當然可以！課程提供 講師 email 信箱，讓你可以隨時提問，確保學習不卡關。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
