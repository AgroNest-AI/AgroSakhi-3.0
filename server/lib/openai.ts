import OpenAI from "openai";

// Initialize the OpenAI client with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Generate crop recommendations based on local conditions
 */
export async function generateCropRecommendations(
  location: string,
  soilType?: string,
  soilPH?: number,
  soilMoisture?: number,
  temperature?: number,
  season?: string
): Promise<{ cropName: string; variety: string; reason: string; matchPercentage: number }[]> {
  try {
    const prompt = `Based on the following farm conditions, recommend suitable crops to grow:
    
Location: ${location}
${soilType ? `Soil Type: ${soilType}` : ''}
${soilPH ? `Soil pH: ${soilPH}` : ''}
${soilMoisture ? `Soil Moisture: ${soilMoisture}%` : ''}
${temperature ? `Average Temperature: ${temperature}°C` : ''}
${season ? `Current Season: ${season}` : ''}

Provide recommendations for 3 crops that would grow well in these conditions. For each crop, include the crop name, a recommended variety, a brief reason why it's suitable, and a match percentage (between 70-100).
Format your response as JSON with this structure:
[
  {
    "cropName": "crop name",
    "variety": "specific variety",
    "reason": "brief explanation of why this crop is a good fit",
    "matchPercentage": match percentage as a number
  }
]`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are an agricultural expert AI that provides crop recommendations based on local conditions." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }
    
    const parsedResponse = JSON.parse(content);
    return parsedResponse.length ? parsedResponse : [];
  } catch (error) {
    console.error("Error generating crop recommendations:", error);
    throw error;
  }
}

/**
 * Generate personalized farming advice based on crop and season
 */
export async function generateFarmingAdvice(
  cropName: string,
  growthStage: string,
  issues?: string[]
): Promise<string> {
  try {
    const prompt = `Provide personalized farming advice for the following crop:
    
Crop: ${cropName}
Growth Stage: ${growthStage}
${issues?.length ? `Current Issues: ${issues.join(', ')}` : ''}

Give practical, actionable advice that a farmer can implement immediately. Include information about watering, fertilization, pest control, and any special considerations for the current growth stage.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are an agricultural expert AI that provides personalized farming advice." },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content || "No advice available at this time.";
  } catch (error) {
    console.error("Error generating farming advice:", error);
    throw error;
  }
}

/**
 * Process captured images for plant disease identification
 */
export async function analyzePlantImage(base64Image: string): Promise<{
  healthy: boolean;
  confidence: number;
  disease?: string;
  treatment?: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an agricultural expert AI that can identify plant diseases from images. Provide detailed analysis with treatment recommendations if issues are detected."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this plant image and tell me if there are any diseases or issues. If there are problems, suggest treatments. Respond in JSON format with these fields: healthy (boolean), confidence (number 0-1), disease (string, if applicable), treatment (string, if applicable)."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error("Error analyzing plant image:", error);
    throw error;
  }
}

/**
 * Generate weather impact analysis
 */
export async function analyzeWeatherImpact(
  cropName: string,
  weatherForecast: any
): Promise<string> {
  try {
    const prompt = `Analyze how the following weather forecast might impact the cultivation of ${cropName}:
    
Weather Forecast:
${JSON.stringify(weatherForecast, null, 2)}

Provide insights on:
1. How the forecasted weather might affect the crop
2. Any risks or challenges the farmer should be aware of
3. Specific actions the farmer should take based on the forecast`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are an agricultural expert AI specializing in weather impacts on farming." },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content || "No analysis available at this time.";
  } catch (error) {
    console.error("Error analyzing weather impact:", error);
    throw error;
  }
}

/**
 * Process and respond to farmer voice queries
 */
export async function processVoiceQuery(
  query: string,
  userContext: any
): Promise<string> {
  try {
    const prompt = `The farmer asks: "${query}"
    
Farmer context:
${JSON.stringify(userContext, null, 2)}

Provide a helpful, natural-sounding response that addresses the farmer's query. Use simple language and provide practical advice when appropriate.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are AgroSakhi, a voice assistant for farmers. You provide helpful information and advice about farming in a simple, conversational manner." },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your question.";
  } catch (error) {
    console.error("Error processing voice query:", error);
    throw error;
  }
}