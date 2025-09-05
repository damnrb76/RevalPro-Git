import OpenAI from "openai";

// Initialize OpenAI with API key from server environment
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Get revalidation advice based on a user's question
 * @param question - The user's question about revalidation
 * @returns Promise with the AI response
 */
export async function getRevalidationAdvice(question: string): Promise<string> {
  try {
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are RevalPro Assistant, a specialized AI for helping UK nurses with their NMC revalidation process." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return completion.choices[0]?.message?.content || "Sorry, I wasn't able to generate a response.";
  } catch (error) {
    console.error("Error generating revalidation advice:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional nursing reflection expert helping nurses with their NMC revalidation." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return completion.choices[0]?.message?.content || "Sorry, I wasn't able to generate a reflection template.";
  } catch (error) {
    console.error("Error generating reflection template:", error);
    return "I'm sorry, I encountered an error while generating your reflection template. Please try again later.";
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a CPD specialist for UK nurses helping with NMC revalidation requirements." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return completion.choices[0]?.message?.content || "Sorry, I wasn't able to generate CPD suggestions.";
  } catch (error) {
    console.error("Error generating CPD suggestions:", error);
    return "I'm sorry, I encountered an error while generating CPD suggestions. Please try again later.";
  }
}