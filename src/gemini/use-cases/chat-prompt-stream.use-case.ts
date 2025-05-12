import {
  createPartFromUri,
  
  GoogleGenAI,
} from '@google/genai';
import { ChatPromptDto } from '../dtos/chat-prompt.dto';
import { create } from 'domain';

interface Options {
  model?: string;
  systemInstruction?: string;
}

export const chatPromptStreamUseCase = async (
  ai: GoogleGenAI,
  chatPromptDto: ChatPromptDto,
  options?: Options,
) => {
  const { prompt, files = [] } = chatPromptDto;

    //TODO: REFACTORIZAR
  const uploadedFiles = await Promise.all(
    files.map((file) => {
      return ai.files.upload({
        file: new Blob([file.buffer], {
          type: file.mimetype.includes('image') ? file.mimetype : 'image/jpg',
        }), // string
      });
    }),
  );

  const {
    model = 'gemini-2.0-flash',
    systemInstruction = `
      Responde únicamente en español 
      En formato markdown 
      Usa negritas de esta forma __
      Usa el sistema métrico decimal
  `,
  } = options ?? {};

  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: systemInstruction,
    },
    history: [
      {
        role: "user",
        parts: [{ text: "HelloWWW" }],
      },
      {
        role: "model",
        parts: [{ text: "Hola mundo que tal" }],
      },
    ],
  });

  



  return chat.sendMessageStream({
    message: [
        prompt,
           ...uploadedFiles.map((file) => 
            createPartFromUri(
            file.uri ?? '', file.mimeType ?? ''),
           ),


    ],
  });
};