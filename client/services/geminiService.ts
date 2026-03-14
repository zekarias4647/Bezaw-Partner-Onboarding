
import { GoogleGenAI } from "@google/genai";

// Initialize lazily to prevent immediate crash if key is missing
const getClient = () => {
  const key = process.env.API_KEY || 'DUMMY_KEY_FOR_UI_TESTING';
  return new GoogleGenAI({ apiKey: key });
};

export async function getOnboardingTips(businessName: string) {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 short, encouraging onboarding tips for a supermarket named "${businessName}" joining the Bezaw drive-through platform in Addis Ababa. Keep it concise and professional.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ready to revolutionize drive-through Shopping? Let's get started!";
  }
}

export async function suggestCoordinates(address: string) {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Estimate the latitude and longitude for this area in Addis Ababa: "${address}". Return only as a JSON object like {"lat": 9.0, "lng": 38.0}.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return null;
  }
}
