import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Fetch FAQ from API
  const { data: faqItems = [] } = useQuery({
    queryKey: ['/api/faq'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/faq');
        return await res.json() as FaqItem[];
      } catch (error) {
        // Fallback data if API fails
        return [
          {
            question: "What happens if I don't meet the revalidation requirements?",
            answer: "If you fail to meet the revalidation requirements, your registration may lapse. If this happens, you would need to apply for readmission. The readmission process is more complex than revalidation."
          },
          {
            question: "Who can be my confirmer?",
            answer: "Your confirmer should be your line manager where possible. They can be an NMC-registered nurse or midwife, another healthcare professional, or someone else who is familiar with your work."
          },
          {
            question: "What counts as participatory learning?",
            answer: "Participatory learning involves interaction with other professionals. This could include attending conferences, taking part in case reviews, or participating in group discussions about clinical practices."
          }
        ] as FaqItem[];
      }
    },
  });
  
  const toggleFAQ = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };
  
  return (
    <section>
      <h2 className="text-xl font-bold text-nhs-black mb-4">Frequently Asked Questions</h2>
      <Card className="divide-y divide-nhs-pale-grey">
        {faqItems.map((item, index) => (
          <div className="p-5" key={index}>
            <button 
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              <h3 className="font-semibold text-nhs-black">{item.question}</h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-nhs-blue" />
              ) : (
                <ChevronDown className="w-5 h-5 text-nhs-blue" />
              )}
            </button>
            <div className={cn(
              "mt-2 text-sm text-nhs-dark-grey transition-all duration-200 overflow-hidden",
              openIndex === index ? "max-h-96" : "max-h-0"
            )}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
}
