import { useQuery } from "@tanstack/react-query";
import { Book, Newspaper } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type GuidanceItem = {
  title: string;
  description: string;
  url: string;
};

export default function NmcGuidance() {
  // Fetch guidance from API
  const { data: revalidationGuidelines } = useQuery({
    queryKey: ['/api/guidelines/revalidation'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/guidelines/revalidation');
        return await res.json() as GuidanceItem;
      } catch (error) {
        // Fallback data if API fails
        return {
          title: 'Revalidation Guidelines',
          url: 'https://www.nmc.org.uk/revalidation/',
          description: 'Official NMC guidelines for completing your revalidation requirements.'
        } as GuidanceItem;
      }
    },
  });
  
  // Fetch The Code from API
  const { data: theCode } = useQuery({
    queryKey: ['/api/guidelines/the-code'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/guidelines/the-code');
        return await res.json() as GuidanceItem;
      } catch (error) {
        // Fallback data if API fails
        return {
          title: 'The Code',
          url: 'https://www.nmc.org.uk/standards/code/',
          description: 'Professional standards of practice and behaviour for nurses and midwives.'
        } as GuidanceItem;
      }
    },
  });
  
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-revalpro-black mb-4">NMC Guidance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {revalidationGuidelines && (
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex items-start">
              <div className="mr-4 text-revalpro-blue text-2xl">
                <Book className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-semibold text-revalpro-dark-blue mb-2">{revalidationGuidelines.title}</h3>
                <p className="text-sm text-revalpro-black mb-3">
                  {revalidationGuidelines.description}
                </p>
                <a 
                  href={revalidationGuidelines.url}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-revalpro-blue text-sm font-medium hover:underline"
                >
                  View Guidelines
                </a>
              </div>
            </div>
          </div>
        )}
        
        {theCode && (
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex items-start">
              <div className="mr-4 text-revalpro-green text-2xl">
                <Newspaper className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-semibold text-revalpro-dark-blue mb-2">{theCode.title}</h3>
                <p className="text-sm text-revalpro-black mb-3">
                  {theCode.description}
                </p>
                <a 
                  href={theCode.url}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-revalpro-green text-sm font-medium hover:underline"
                >
                  View The Code
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
