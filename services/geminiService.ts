
import { GoogleGenAI } from "@google/genai";
import { FormState } from '../types';

const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set. Application cannot start.");
}

const ai = new GoogleGenAI({ apiKey });

const generatePromptForGemini = (inputs: FormState): string => {
    return `
Anda adalah seorang penulis skenario ahli dan generator prompt untuk AI video canggih bernama Veo 3.
Tugas Anda adalah mengambil masukan terstruktur di bawah ini dan mengembangkannya menjadi deskripsi adegan sinematik yang kaya, detail, dan sangat kohesif dalam Bahasa Indonesia.

**INPUT DATA:**
- **Karakter:** ${inputs.name}, seorang ${inputs.gender} berusia ${inputs.age} dari ${inputs.origin}. Dia memiliki rambut ${inputs.hair}, kulit ${inputs.skinColor}, dan mengenakan ${inputs.clothing}.
- **Aksi & Ekspresi:** Dia sedang ${inputs.action} dengan ekspresi wajah yang ${inputs.expression}.
- **Setting:** Adegan berlokasi di ${inputs.location} pada waktu ${inputs.time}.
- **Sinematografi:** Gerakan kamera adalah ${inputs.cameraMovement}, dengan pencahayaan ${inputs.lighting} untuk menciptakan suasana ${inputs.videoMood}. Gaya visualnya adalah ${inputs.videoStyle}.
- **Audio:** Latar belakang suara diisi dengan ${inputs.sound}.
- **Dialog:** Karakter mungkin mengucapkan: "${inputs.dialogue}"
- **Detail Tambahan:** ${inputs.additionalDetails}
- **Hal yang Dihindari (Negative Prompt):** ${inputs.negativePrompt}

Berdasarkan data di atas, tulis deskripsi adegan sinematik dalam satu paragraf naratif yang kohesif dalam Bahasa Indonesia. Deskripsi harus detail, imersif, dan menggabungkan semua elemen yang diberikan. Pastikan panjang totalnya maksimal 900 karakter dan secara eksplisit HINDARI elemen apa pun dari "Negative Prompt".
`;
};

export const generateDetailedPrompt = async (inputs: FormState): Promise<string> => {
    const prompt = generatePromptForGemini(inputs);
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating detailed prompt:", error);
        throw new Error("Failed to communicate with the Gemini API for prompt generation.");
    }
};


export const translatePrompt = async (indonesianPrompt: string, dialogue: string, negativePrompt: string): Promise<string> => {
    const prompt = `
Translate the following Indonesian video prompt and its associated negative prompt into fluent, cinematic English.

The final output must be a single text block. First, provide the translated main prompt. Then, on a new line, add "Negative prompt: " followed by the translated negative prompt terms.

It is absolutely critical that you DO NOT translate the specific quote intended for dialogue in the main prompt. 
The dialogue is marked with <<<DIALOGUE>>> and <<<END_DIALOGUE>>>. Keep the text between these markers exactly as it is in the final English output.

Indonesian Prompt:
"""
${indonesianPrompt.replace(dialogue, `<<<DIALOGUE>>>${dialogue}<<<END_DIALOGUE>>>`)}
"""

Indonesian Negative Prompt:
"""
${negativePrompt}
"""

Return ONLY the final English text containing the translated main prompt and the negative prompt as specified.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
        });
        
        let translatedText = response.text.trim();
        translatedText = translatedText.replace("<<<DIALOGUE>>>", "").replace("<<<END_DIALOGUE>>>", "");
        return translatedText;
    } catch (error) {
        console.error("Error translating prompt:", error);
        throw new Error("Failed to communicate with the Gemini API for translation.");
    }
};
