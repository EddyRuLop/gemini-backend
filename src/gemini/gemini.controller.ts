import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';

import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { GenerateContentResponse } from '@google/genai';
import { ChatPromptDto } from './dtos/chat-prompt.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}


  async outputStreamResponse(res: Response, stream: AsyncGenerator<GenerateContentResponse, any, any> ){
    // res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);


let resultText = '';
    for await (const chunk of stream) {
      const piece = chunk.text;
      resultText += piece;
      res.write(piece);
    }

    res.end();
    return resultText;
  }

  @Post('basic-prompt')
  basicPrompt(@Body() basicPromptDto: BasicPromptDto) {
    return this.geminiService.basicPrompt(basicPromptDto);
  }

  @Post('basic-prompt-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async basicPromptStream(
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    basicPromptDto.files = files;

    console.log(files);

    const stream = await this.geminiService.basicPromptStream(basicPromptDto);
    void this.outputStreamResponse(res, stream);
   
  }

  @Post('chat-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async chatStream(
    @Body() chatPromptDto: ChatPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    chatPromptDto.files = files;

    console.log(files);

    const stream = await this.geminiService.chatStream(chatPromptDto);

    const data = await this.outputStreamResponse(res, stream);


    console.log({text: chatPromptDto.prompt});
    console.log(data);
  }
}