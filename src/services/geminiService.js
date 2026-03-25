import { GoogleGenAI } from '@google/genai'

/**
 * Returns the API key from the environment.
 * In Vite-based projects, set VITE_GEMINI_API_KEY in your .env file.
 * The variable is accessed at build time via import.meta.env.
 */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

let _client = null

function getClient() {
  if (!API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not configured. Add it to your .env file.')
  }
  if (!_client) {
    _client = new GoogleGenAI({ apiKey: API_KEY })
  }
  return _client
}

/**
 * Sends a text prompt to the Gemini API and returns the response text.
 *
 * @param {string} prompt - The text prompt to send.
 * @returns {Promise<string>} The generated response text.
 */
export async function generateResponse(prompt) {
  if (!prompt || !prompt.trim()) {
    return ''
  }

  const client = getClient()
  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  })

  const text = response.text
  if (!text || !text.trim()) {
    return 'Отримано пусту відповідь. Будь ласка, спробуйте ще раз.'
  }

  return text
}
