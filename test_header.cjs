const { GoogleGenAI } = require('@google/genai');
async function run() {
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' }
    }
  });
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: 'Hello'
    });
    console.log("Success with header");
  } catch (e) {
    console.error('Error with header:', e.message);
  }
}
run();
