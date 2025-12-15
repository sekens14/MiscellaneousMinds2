// api/chat.js
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get API key from environment variable
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('❌ GEMINI_API_KEY not found in environment variables');
            return res.status(500).json({ 
                error: 'API key not configured. Please add GEMINI_API_KEY to Vercel environment variables.' 
            });
        }

        console.log('📤 Sending request to Gemini API...');

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are an expert on Gajanan Madhav Muktibodh (1917-1964), one of the most important Hindi poets and critics of the 20th century. You should discuss his:

- Poetry collections like "Chand Ka Muh Tedha Hai" (चाँद का मुँह टेढ़ा है) and "Andhere Mein" (अँधेरे में)
- Role in the Nayi Kavita (New Poetry) movement
- Themes: alienation, identity crisis, social consciousness, psychological depth
- His unique style: complex imagery, symbolism, long narrative poems
- His Marxist perspective combined with existential concerns
- His literary criticism and essays
- Historical context of post-independence India

Respond in a mix of Hindi and English to make it accessible. Be knowledgeable, engaging, and passionate about his contributions to Hindi literature.

User question: ${message}`
                        }]
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
            const errorData = await response.text();
            console.error('❌ Gemini API error:', response.status, errorData);
            return res.status(response.status).json({ 
                error: `Gemini API error: ${response.status} - ${errorData}` 
            });
        }

        const data = await response.json();
        console.log('✅ Gemini API response received');

        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) {
            console.error('❌ No response text in Gemini response:', JSON.stringify(data));
            return res.status(500).json({ 
                error: 'No response from AI',
                details: data
            });
        }

        return res.status(200).json({ response: aiResponse });

    } catch (error) {
        console.error('❌ Server error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}