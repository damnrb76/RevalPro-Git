import OpenAI from "openai";
import { getFallbackResponse, getFallbackReflectionTemplate, getFallbackCpdSuggestions } from "./fallback-responses";

// Initialize OpenAI with the API key from environment variables
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// Try both environment variable formats since we're in a browser context
const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;

// Create OpenAI instance with proper error handling
let openai: OpenAI | null = null;

try {
  if (apiKey) {
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Allows usage in browser environment
    });
    console.log("OpenAI service initialized successfully");
  } else {
    console.warn("OpenAI API key not found in environment variables");
  }
} catch (error) {
  console.error("Failed to initialize OpenAI:", error);
}

/**
 * Function to safely generate content with GPT, handling any potential errors
 * @param prompt The prompt to send to the API
 * @param fallbackResponse A fallback response if the API is not available
 * @returns Promise with the AI response text
 */
async function safeGenerateContent(
  prompt: string, 
  fallbackResponse: string = "Sorry, I'm unable to provide a response at this time."
): Promise<string> {
  // If OpenAI client is not available, use the fallback
  if (!openai || !apiKey) {
    console.log("Using fallback response (OpenAI client not available)");
    return fallbackResponse;
  }
  
  try {
    // Set a timeout to prevent hanging requests (20 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    
    // Make the API request (we've already checked that openai is not null)
    const completion = await (openai as OpenAI).chat.completions.create({
      model: "gpt-4o", // Using the latest OpenAI model
      messages: [
        { role: "system", content: "You are RevalPro Assistant, a specialized AI for helping UK nurses with their NMC revalidation process." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7, // Slightly creative but still focused
      max_tokens: 1500, // Allow for detailed responses
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    // Extract the response text
    const responseText = completion.choices[0]?.message?.content || fallbackResponse;
    return responseText;
  } catch (error) {
    console.error("Error generating content from OpenAI:", error);
    // Use fallback response in case of API errors
    return fallbackResponse;
  }
}

/**
 * Get revalidation advice based on a user's question
 * @param question - The user's question about revalidation
 * @returns Promise with the AI response
 */
export async function getRevalidationAdvice(question: string): Promise<string> {
  // Create fallback response from our predefined responses
  const fallbackResponse = getFallbackResponse(question);
  
  // Add context about nursing revalidation to help GPT understand the domain
  const prompt = `
  You are RevalPro Assistant, a specialized AI for helping UK nurses with their NMC (Nursing and Midwifery Council) revalidation process. 
  Nurses need to revalidate every 3 years to maintain their registration. The requirements include:
  - 450 practice hours (or 900 if revalidating as both a nurse and midwife)
  - 35 hours of CPD including 20 participatory learning hours
  - 5 pieces of practice-related feedback
  - 5 written reflective accounts
  - Reflective discussion
  - Health and character declaration
  - Professional indemnity arrangement
  - Confirmation from an appropriate person
  
  Respond to the following question about nursing revalidation in the UK:
  ${question}
  
  Keep your response friendly, informative, and specific to UK nursing practices. 
  Provide accurate information based on NMC guidelines. If you're unsure, suggest where they might find reliable information.
  `;

  return safeGenerateContent(prompt, fallbackResponse);
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
  // Create fallback reflection template
  const fallbackTemplate = getFallbackReflectionTemplate(experience, codeSection);
  
  const prompt = `
  As a professional nursing reflection expert, help create a reflective account template for a UK nurse's NMC revalidation.
  
  The nurse had this experience: ${experience}
  
  This relates to this section of The Code: ${codeSection}
  
  Create a structured reflection that includes:
  1. What happened (brief description of the experience or event)
  2. The nature of the experience (describe what you learned from CPD, feedback or event)
  3. What you learned from the experience
  4. How this learning changed or improved your practice
  5. How this relates to the Code section mentioned
  
  Format this as a first-person narrative that the nurse can use as a starting point for their own reflection.
  Keep it professional, thoughtful, and focused on learning and development.
  `;

  return safeGenerateContent(prompt, fallbackTemplate);
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
  // Create fallback CPD suggestions
  const fallbackSuggestions = getFallbackCpdSuggestions(specialty, interests);
  
  const prompt = `
  As a CPD specialist for UK nurses, suggest relevant continuing professional development activities for a nurse with the following details:
  
  Specialty or area of practice: ${specialty}
  Professional interests/goals: ${interests}
  
  Suggest 5 specific CPD activities that:
  1. Would be relevant to their specialty and interests
  2. Include a mix of participatory (involving interaction with others) and non-participatory learning
  3. Are practical and accessible
  4. Align with NMC requirements for revalidation
  5. Would demonstrate commitment to ongoing professional development
  
  For each suggestion, explain:
  - The activity and its format
  - Why it's relevant to their specialty/interests
  - What type of learning it represents (participatory or non-participatory)
  - How it contributes to their professional development
  
  Format your response as a clear, bulleted list with a brief introduction and conclusion.
  `;

  return safeGenerateContent(prompt, fallbackSuggestions);
}

export default {
  getRevalidationAdvice,
  generateReflectiveTemplate,
  suggestCpdActivities,
};