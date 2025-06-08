import {
  Accordion,
  AccordionItem,
  // AccordionTrigger,
  // AccordionContent,
} from "@/components/ui/accordion";
import { Section } from "../course-detail.service";

interface CourseAccordionProps {
  sections: Section[];
}

export const CourseAccordion = ({ sections }: CourseAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {[...sections]
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((section, index) => (
          <AccordionItem
            className="py-6"
            key={section.id}
            value={`item-${index + 1}`}
          >
            {/* <AccordionTrigger> */}
            <p>{section.title}</p>
            {/* </AccordionTrigger> */}
          </AccordionItem>
        ))}
    </Accordion>
  );
};
