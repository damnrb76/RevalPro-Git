import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Configure the AI model
const defaultConfig: GenerationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

// Create a model instance with the gemini-pro model
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: defaultConfig,
});

/**
 * Get revalidation advice based on a user's question
 * @param question - The user's question about revalidation
 * @returns Promise with the AI response
 */
export async function getRevalidationAdvice(question: string): Promise<string> {
  try {
    // Add context about nursing revalidation to help Gemini understand the domain
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

    // Generate content using the model
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting advice from Gemini:", error);
    return "I'm sorry, I encountered an error when processing your question. Please try again later.";
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

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating reflective template:", error);
    return "I'm sorry, I encountered an error when generating your reflective template. Please try again later.";
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

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error suggesting CPD activities:", error);
    return "I'm sorry, I encountered an error when generating CPD suggestions. Please try again later.";
  }
}

export default {
  getRevalidationAdvice,
  generateReflectiveTemplate,
  suggestCpdActivities,
};