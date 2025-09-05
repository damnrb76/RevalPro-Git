/**
 * Fallback predefined responses for common revalidation questions
 * These are used when the Gemini API key is not available
 */

// Common revalidation questions and their static responses
const questionResponses: Record<string, string> = {
  // Practice hours
  "hours": `For NMC revalidation, you need to have practiced a minimum of 450 hours over the three years prior to your revalidation date. If you're registered as both a nurse and midwife, you need 900 hours (450 for each role).

Hours can be clinical or non-clinical (like management, education, or research) as long as they relate to your registration. You must keep accurate records of your practice hours, including dates, hours worked, and the scope of practice.`,

  "practice": `You need 450 practice hours (or 900 if you're registered as both a nurse and midwife) in the three years preceding your revalidation date. These can be in any setting where you use your nursing or midwifery knowledge and experience.

You must maintain detailed records that include:
- Dates of practice
- Number of hours worked
- Name and address of organization
- Scope of practice
- Work setting
- Description of work

The NMC may ask to see these records if your application is selected for verification.`,

  // CPD
  "cpd": `For NMC revalidation, you need 35 hours of Continuing Professional Development (CPD), of which 20 hours must be participatory learning (involving interaction with others).

All CPD must:
- Be relevant to your practice as a nurse or midwife
- Include learning that has made a difference to your practice
- Be recorded with details like dates, topics, hours, and a brief outline of how it relates to your practice`,

  "participatory": `Participatory learning involves interacting with other professionals as part of the learning activity. You need at least 20 hours of this type of learning out of your total 35 CPD hours.

Examples include:
- Attending conferences, workshops, or seminars
- Group discussions or journal clubs
- Team training or meetings with a learning focus
- Clinical supervision
- Structured visits to other practice areas

The key is that you must be learning with others - not just learning on your own.`,

  // Reflective accounts
  "reflections": `For NMC revalidation, you need to prepare five written reflective accounts that explain:

1. What the experience was
2. What you learned from it
3. How it improved your work
4. How it relates to the Code

These reflections can be based on:
- CPD activities
- Practice-related feedback
- Everyday work situations

Each account should demonstrate what you learned and how it relates to the Code's standards of practice. Keep them professionally written and focused on your learning.`,

  "reflective discussion": `After writing your five reflective accounts, you need to have a reflective discussion with another NMC registrant.

This discussion should:
- Cover all five of your reflective accounts
- Explore what you learned and how this relates to the Code
- Be with someone who understands your area of practice

You need to record this discussion on the NMC form, which both you and your discussion partner must sign. Your discussion partner must be an NMC-registered nurse or midwife.`,

  // Feedback
  "feedback": `You need five pieces of practice-related feedback for NMC revalidation. These can come from various sources:

- Patients/service users or their families
- Colleagues (nurses, doctors, healthcare assistants, etc.)
- Students
- Formal reviews or appraisals
- Complaints or compliments

The feedback can be verbal, written, or formal. It doesn't all need to be positive - constructive criticism can be valuable for reflection. For each piece of feedback, record what it was, when you received it, and what you learned from it.`,

  // Confirmer
  "confirmer": `The confirmer is someone who verifies that you've met all the revalidation requirements. They must:

- Discuss your revalidation evidence with you
- Review your entire portfolio of evidence
- Sign the confirmation form confirming you've met all requirements

Your confirmer should be your line manager where possible. If not, they can be:
- Another NMC registrant
- Another healthcare professional
- Someone who is regulated in the UK (e.g., doctor, pharmacist)
- Someone not on a regulated register who has appropriate knowledge of your work

Meet with them face-to-face to go through your evidence before they sign the form.`,

  // Health and character
  "health declaration": `For the health and character declaration, you must:

1. Declare any cautions, charges, or convictions
2. Confirm your health allows you to practice safely
3. Declare you have the appropriate indemnity insurance

This is a self-declaration that confirms you're of good health and character to remain on the register. You don't normally need to provide evidence unless requested by the NMC.`,

  "indemnity": `You must have an appropriate professional indemnity arrangement in place when practicing. This protects patients/clients if they suffer harm because of negligence.

For most employed nurses, this is provided by your employer. If you're self-employed or work in the private sector, you need your own arrangement through an insurance company or professional body.

You only need to declare that you have appropriate cover - you don't need to send evidence to the NMC unless specifically requested.`,

  // Timeline and deadlines
  "revalidation deadline": `Your revalidation deadline is the same as your registration renewal date, which happens every three years. You can find this on your NMC Online account.

The NMC will notify you 60 days before your revalidation application is due. You can submit your application from 60 days before your renewal date.

Don't leave it to the last minute - if you miss your deadline, you'll be removed from the register and won't be able to practice legally until reinstated.`,

  "timeline": `Here's a suggested timeline for revalidation preparation:

12-36 months before deadline:
- Start collecting practice hours and CPD activities
- Make regular entries in your portfolio

6-12 months before:
- Complete reflective accounts
- Gather feedback

3-6 months before:
- Arrange reflective discussion
- Select your confirmer

1-3 months before:
- Complete health and character declaration
- Have confirmer review and sign forms

60 days before:
- NMC opens your application window
- Submit your application online`
};

/**
 * Get a fallback response for a question based on keyword matching
 * @param question The user's question
 * @returns A relevant response or a default message
 */
export function getFallbackResponse(question: string): string {
  // Normalize question for better matching
  const normalizedQuestion = question.toLowerCase();
  
  // Check for keyword matches
  for (const [keyword, response] of Object.entries(questionResponses)) {
    if (normalizedQuestion.includes(keyword)) {
      return response;
    }
  }
  
  // Default response if no match found
  return `I can provide information about NMC revalidation requirements, including:

- Practice hours (450 hours required, or 900 for dual registration)
- CPD requirements (35 hours total, with 20 hours participatory)
- Reflective accounts (5 required)
- Feedback (5 pieces required)
- The reflective discussion
- Finding a confirmer
- Health and character declaration
- Indemnity arrangements
- Revalidation deadlines and process

Please ask a specific question about any of these areas, and I'll provide more detailed guidance.`;
}

/**
 * Generate a reflective account template based on the experience and code section
 * This is a fallback when Gemini AI is not available
 */
export function getFallbackReflectionTemplate(experience: string, codeSection: string): string {
  const codeSectionInfo = getCodeSectionInfo(codeSection);
  
  return `# Reflective Account

## Description of experience or event
${experience}

## What did I learn from this experience?
[Use this space to describe what you learned from this experience. Consider both the technical aspects and the interpersonal elements of your practice.]

## How has this learning changed or improved my practice?
[Explain how this learning has changed your approach to nursing, what you do differently now, and how this benefits patients or colleagues.]

## How this relates to the Code: ${codeSectionInfo.title}
This experience relates to the '${codeSectionInfo.title}' section of the NMC Code, specifically:

${codeSectionInfo.points.map(point => `- ${point}`).join('\n')}

[Expand on how your actions in this situation demonstrated these Code principles and how your learning reinforces them.]

---
This reflection demonstrates how I continue to develop as a registered nurse while upholding the standards expected by the NMC Code.`;
}

/**
 * Generate CPD activity suggestions based on specialty
 * This is a fallback when Gemini AI is not available
 */
export function getFallbackCpdSuggestions(specialty: string, interests: string): string {
  const specialtyLower = specialty.toLowerCase();
  
  // Base suggestions that work for most specialties
  let suggestions = `# CPD Activity Suggestions

Based on your specialty in ${specialty}${interests ? ` and interests in ${interests}` : ''}, here are 5 relevant CPD activities that would support your professional development and NMC revalidation:

`;

  // Add general CPD activities for all nurses
  suggestions += `## 1. Evidence-Based Practice Workshop
**Type:** Participatory learning
**Description:** Attend a workshop focusing on latest evidence-based practices in healthcare, with specific sessions relevant to ${specialty}.
**Benefit:** Enhances clinical decision-making skills and ensures your practice remains current with latest research.

## 2. Reflective Practice Journal Club
**Type:** Participatory learning
**Description:** Join or start a monthly journal club with colleagues to review and discuss recent research papers.
**Benefit:** Develops critical analysis skills while fulfilling participatory hours requirement.

## 3. Online Course on Clinical Skills
**Type:** Non-participatory learning (with certificate)
**Description:** Complete an RCN-accredited online course focusing on specialized skills relevant to your practice area.
**Benefit:** Flexibility to complete at your own pace while developing specific competencies.

## 4. Shadowing Experience
**Type:** Participatory learning
**Description:** Arrange to shadow a specialist nurse or advanced practitioner in your field for a day.
**Benefit:** Provides insight into advanced practice and different approaches to care.

## 5. Professional Conference Attendance
**Type:** Participatory learning
**Description:** Attend a nursing conference focused on ${specialty} or broader healthcare themes.
**Benefit:** Networking opportunities plus exposure to the latest developments across multiple sessions.

Remember to document each activity, including the date, number of hours, and a brief reflection on how it relates to your practice and the NMC Code.`;

  return suggestions;
}

/**
 * Helper function to get information about a specific Code section
 */
function getCodeSectionInfo(codeSection: string): { title: string; points: string[] } {
  switch (codeSection) {
    case "prioritise-people":
      return {
        title: "Prioritise people",
        points: [
          "Treat people as individuals and uphold their dignity",
          "Listen to people and respond to their preferences and concerns",
          "Make sure that people's physical, social and psychological needs are assessed and responded to",
          "Act in the best interests of people at all times"
        ]
      };
    case "practice-effectively":
      return {
        title: "Practice effectively",
        points: [
          "Always practice in line with the best available evidence",
          "Communicate clearly",
          "Work cooperatively",
          "Share your skills, knowledge and experience for the benefit of people receiving care and your colleagues"
        ]
      };
    case "preserve-safety":
      return {
        title: "Preserve safety",
        points: [
          "Recognize and work within the limits of your competence",
          "Be open and candid with all service users about all aspects of care and treatment",
          "Always offer help if an emergency arises in your practice setting or anywhere else",
          "Act without delay if you believe that there is a risk to patient safety or public protection"
        ]
      };
    case "promote-professionalism":
      return {
        title: "Promote professionalism and trust",
        points: [
          "Uphold the reputation of your profession at all times",
          "Display a personal commitment to the standards of practice and behavior set out in the Code",
          "Stay objective and have clear professional boundaries at all times with people in your care",
          "Fulfill all registration requirements"
        ]
      };
    default:
      return {
        title: "Professional Standards",
        points: [
          "Prioritize people's best interests",
          "Practice effectively using best available evidence",
          "Preserve safety through competent care",
          "Promote professionalism and uphold public trust"
        ]
      };
  }
}

export default {
  getFallbackResponse,
  getFallbackReflectionTemplate,
  getFallbackCpdSuggestions
};