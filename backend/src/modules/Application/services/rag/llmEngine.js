import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Prompt template for structured resume extraction
 */
const buildExtractionPrompt = (retrievedContext) => `
You are an expert AI recruiting assistant specializing in Resume/CV parsing for a job board application.
Analyze the following retrieved sections of a candidate's resume and extract accurate details to auto-fill an application form.

Retrieved Resume Content:
${retrievedContext}

Return a valid JSON object strictly matching this schema:
{
  "fullName": "Candidate full legal name",
  "email": "Primary email address",
  "phone": "Candidate contact number with country code if available",
  "location": "Candidate city, state/country or full location",
  "experience": "A clear, well-written professional summary (2 to 4 sentences) detailing the candidate's years of experience, current/recent role, core domains, and major achievements.",
  "skills": "Comma-separated list of top technical and professional skills (e.g. React, Node.js, Express, MongoDB)",
  "portfolio": "Portfolio URL, GitHub profile, or LinkedIn profile URL",
  "availability": "Estimated availability (e.g., Immediate, 2 Weeks, 1 Month, or leave empty if unknown)",
  "salaryExpectation": "Expected annual salary if stated or leave empty"
}

Important Instructions:
- Do NOT fabricate or hallucinate values. If a field cannot be inferred from the resume, leave it as an empty string "".
- Ensure "skills" is a clean, comma-separated string.
- Provide a coherent, polished summary in "experience".
- Output ONLY the JSON object. No preamble or markdown code fences.
`.trim();

/**
 * Execute LLM extraction using OpenAI
 * @param {string} retrievedContext - The RAG retrieved context
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<Object>} Extracted JSON fields
 */
export const queryOpenAI = async (retrievedContext, apiKey) => {
    try {
        const openai = new OpenAI({ apiKey });
        const prompt = buildExtractionPrompt(retrievedContext);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional resume information extraction engine that always responds in strict valid JSON.'
                },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1
        });

        const content = response.choices?.[0]?.message?.content;
        return JSON.parse(content || '{}');
    } catch (error) {
        console.error('OpenAI LLM extraction failed:', error.message);
        throw error;
    }
};

/**
 * Execute LLM extraction using Google Gemini
 * @param {string} retrievedContext - The RAG retrieved context
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<Object>} Extracted JSON fields
 */
export const queryGemini = async (retrievedContext, apiKey) => {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.1
            }
        });

        const prompt = buildExtractionPrompt(retrievedContext);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return JSON.parse(responseText || '{}');
    } catch (error) {
        console.error('Gemini LLM extraction failed:', error.message);
        throw error;
    }
};

/**
 * High-level LLM query dispatcher
 * @param {string} retrievedContext - Grounded RAG context
 * @returns {Promise<Object>} AI extracted structured data
 */
export const queryLlm = async (retrievedContext) => {
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (openaiKey) {
        console.log('Querying OpenAI LLM (gpt-4o-mini)...');
        return await queryOpenAI(retrievedContext, openaiKey);
    }

    if (geminiKey) {
        console.log('Querying Google Gemini LLM (gemini-1.5-flash)...');
        return await queryGemini(retrievedContext, geminiKey);
    }

    console.log('No LLM API keys detected. Bypassing AI generation.');
    return {};
};

export default queryLlm;
