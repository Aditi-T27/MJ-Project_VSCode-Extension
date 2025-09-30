import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
export const ai = new GoogleGenerativeAI(apiKey);

export const geminiModel = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
