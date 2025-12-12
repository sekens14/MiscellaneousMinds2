// api/chat.js - Serverless Function for Gemini API

export default async function handler(req, res) {
  // CORS Headers - Allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Get API key from environment variable
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found');
      res.status(500).json({ error: 'API key not configured' });
      return;
    }

    // System prompt about Muktibodh
    const systemPrompt = `You are an expert on Gajanan Madhav Muktibodh (1917-1964), the influential Hindi modernist poet and writer.

BIOGRAPHY:
- Born in 1917 in Shivpuri, Madhya Pradesh
- Key figure in Nayi Kavita (New Poetry) movement
- Influenced by Marxism, existentialism, and psychoanalysis
- Worked as a journalist and teacher
- Died in 1964 at age 47

MAJOR WORKS:
- "Chand ka Munh Tedha Hai" (चाँद का मुँह टेढ़ा है) - 1964
- "Andhere Mein" (अंधेरे में) - His masterpiece
- "Ek Sahityik ki Diary" (एक साहित्यिक की डायरी)
- "Brahmarakshasa" - Famous poem about intellectual alienation

THEMES:
- Social alienation and intellectual struggle
- Inner psychological conflicts
- Political awakening and Marxist ideology
- Surrealism and complex imagery
- Urban alienation and modern anxiety

Answer questions in a knowledgeable, accessible way. Respond in Hindi or English based on the user's language.`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\nUser question: ${message}` }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      res.status(response.status).json({ 
        error: 'Failed to get response from AI',
        details: errorData 
      });
      return;
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      res.status(200).json({ response: aiResponse });
    } else {
      res.status(500).json({ 
        error: 'Invalid response format from AI',
        data 
      });
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}