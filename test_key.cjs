const { GoogleGenAI } = require('@google/genai');
async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Hello'
    });
    console.log(res.text);
  } catch (e) {
    console.error('Error:', e.message);
  }
}
run();
