import { GoogleGenerativeAI, ResponseSchema } from "npm:@google/generative-ai";
import { Buffer } from "node:buffer";

const apiKey = Deno.env.get("GOOGLE_API_KEY");
if (!apiKey) throw new Error("No GOOGLE_API_KEY env var found");

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const extractDataWithGemini = async (
    file: File,
    prompt: string,
    responseSchema: ResponseSchema,
    mimeType: string = "application/pdf",
) => {
    let base64file: string;

    try {
        base64file = await file.arrayBuffer().then((buffer) =>
            Buffer.from(buffer).toString("base64")
        );
    } catch (error) {
        throw new Error(
            "Error al leer el archivo: " + (error as Error).message,
        );
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const chatSession = model.startChat({
        generationConfig: {
            temperature: 0.75,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
        history: [
            {
                role: "user",
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64file,
                        },
                    },
                    { text: prompt },
                ],
            },
        ],
    });

    try {
        const result = await chatSession.sendMessage("INSERT_INPUT_HERE");

        const responseText = result.response?.text();
        if (!responseText) {
            throw new Error("La respuesta del modelo está vacía o es inválida");
        }
        return JSON.parse(responseText);
    } catch (error) {
        throw new Error(
            "Error al procesar la respuesta del modelo: " +
                (error as Error).message,
        );
    }
};

export async function getGeminiResponse(file: File, prompt: string) {
    let base64file: string;

    try {
        base64file = await file.arrayBuffer().then((buffer) =>
            Buffer.from(buffer).toString("base64")
        );
    } catch (error) {
        throw new Error(
            "Error al leer el archivo: " + (error as Error).message,
        );
    }

    const chatSession = model.startChat({
        generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
        },
        history: [
            {
                role: "user",
                parts: [
                    {
                        inlineData: {
                            mimeType: file.type,
                            data: base64file,
                        },
                    },
                    { text: prompt },
                ],
            },
        ],
    });

    try {
        const result = await chatSession.sendMessage("INSERT_INPUT_HERE");

        const responseText = result.response?.text();
        if (!responseText) {
            throw new Error("La respuesta del modelo está vacía o es inválida");
        }
        return JSON.parse(responseText);
    } catch (error) {
        throw new Error(
            "Error al procesar la respuesta del modelo: " +
                (error as Error).message,
        );
    }
}
