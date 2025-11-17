import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import type { CollectionEntry } from "astro:content";

interface FAQProps {
  questions: CollectionEntry<"faq">[];
}

export function FAQ({ questions }: FAQProps) {
  return (
    <Accordion type="single">
      {questions.map((question) => (
        <AccordionItem value={question.id} key={question.id}>
          <AccordionTrigger className="text-lg">
            {question.data.question}
          </AccordionTrigger>
          <AccordionContent>
            <div
              className="text-base"
              dangerouslySetInnerHTML={{
                __html: question.rendered?.html ?? "",
              }}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
