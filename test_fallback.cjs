const { GoogleGenAI } = require('@google/genai');
async function run() {
  const ai = new GoogleGenAI({ apiKey: 'BAD_KEY', httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
  try {
    await ai.models.generateContent({ model: 'gemini-3.1-flash', contents: 'Hello' });
  } catch (e) {
    console.log("Error message:", e.message);
    console.log("Includes?", e.message && e.message.includes('API key not valid'));
  }
}
run();
