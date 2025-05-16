// API service for making server-side AI requests without exposing API keys in browser
import { getFallbackResponse, getFallbackReflectionTemplate, getFallbackCpdSuggestions } from "./fallback-responses";
import { apiRequest } from "./queryClient";

/**
 * Get revalidation advice based on a user's question - handled server-side
 * @param question - The user's question about revalidation
 * @returns Promise with the AI response
 */
export async function getRevalidationAdvice(question: string): Promise<string> {
  try {
    // Server-side API call
    const response = await apiRequest("POST", "/api/ai/advice", { question });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error getting AI advice:", error);
    // Fallback to local responses if API call fails
    return getFallbackResponse(question);
  }
}

/**
 * Generate a reflective account template based on user input
 * @param experience - Brief description of the experience
 * @param codeSection - NMC code section related to the reflection
 * @returns Promise with the generated reflective account
 */
export async function generateReflectiveTemplate(
  experience: string,
  codeSection: string
): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/ai/reflection", { 
      experience, 
      codeSection 
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error generating reflection template:", error);
    return getFallbackReflectionTemplate(experience, codeSection);
  }
}

/**
 * Get suggested CPD activities based on a nurse's specialty
 * @param specialty - The nurse's specialty or area of practice
 * @param interests - The nurse's professional interests or goals
 * @returns Promise with suggested CPD activities
 */
export async function suggestCpdActivities(
  specialty: string,
  interests: string
): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/ai/cpd", { 
      specialty, 
      interests 
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error generating CPD suggestions:", error);
    return getFallbackCpdSuggestions(specialty, interests);
  }
}

export default {
  getRevalidationAdvice,
  generateReflectiveTemplate,
  suggestCpdActivities,
};