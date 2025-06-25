import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PreparationsService } from './preparations.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('preparations')
export class PreparationsController {
  constructor(private readonly preparationsService: PreparationsService) { }

}
