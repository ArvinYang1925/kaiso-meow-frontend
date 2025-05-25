import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Section } from "../course-detail.service";

interface CourseAccordionProps {
  sections: Section[];
}

export const CourseAccordion = ({ sections }: CourseAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {sections
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((section, index) => (
          <AccordionItem key={section.id} value={`item-${index + 1}`}>
            <AccordionTrigger><p>第{section.orderIndex}章：{section.title}</p> </AccordionTrigger>
            <AccordionContent>
              <p>{section.content}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};
