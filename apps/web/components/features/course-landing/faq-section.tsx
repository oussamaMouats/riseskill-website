import type { CourseFaqItem } from "@riseskill/shared";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection({ faqItems }: { faqItems: CourseFaqItem[] }) {
  if (faqItems.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-brand-navy">Questions fréquentes</h2>
      <Accordion type="multiple" className="mt-3">
        {faqItems.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left text-brand-navy">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
