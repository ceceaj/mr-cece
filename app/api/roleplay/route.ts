import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { history, scenario, userMessage } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mocked response for demo purposes if API key is not set
      console.warn("No GEMINI_API_KEY found, using fallback mock response.");
      return NextResponse.json({
        reply: "Sorry, I am just a mock bot because the API key is not set. But you sound great! 🚀",
        grammarFeedback: "Your grammar is perfectly mocked."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are an AI language learning coach acting as a conversation partner in the following scenario: "${scenario}".
Your goal is to have a natural back-and-forth conversation with the user.
Please respond in English. Keep your responses relatively short, conversational, and natural.
Also, evaluate the user's latest message for grammar and naturalness.
You must return your response STRICTLY as a JSON object with two fields:
- "reply": Your conversational response to the user's message.
- "grammarFeedback": A brief, constructive feedback on their grammar (in Indonesian). If their grammar is perfect, say "Sempurna!".

Example response format:
{
  "reply": "Hi there! How can I help you today?",
  "grammarFeedback": "Sempurna!"
}
`;

    // Convert history to Gemini format
    const chatHistory = history.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I will act as the character in the scenario and provide JSON responses." }] },
        ...chatHistory,
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();
    
    // Parse the JSON response
    try {
      const parsed = JSON.parse(responseText);
      return NextResponse.json({
        reply: parsed.reply || "I didn't quite catch that.",
        grammarFeedback: parsed.grammarFeedback || "Baik."
      });
    } catch (e) {
      console.error("Failed to parse JSON from Gemini:", responseText);
      return NextResponse.json({
        reply: responseText,
        grammarFeedback: "Tidak dapat mengevaluasi grammar saat ini."
      });
    }

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Gagal menghubungi AI." },
      { status: 500 }
    );
  }
}
