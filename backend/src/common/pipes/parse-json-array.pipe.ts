// src/common/pipes/parse-json-array.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonArrayPipe implements PipeTransform {
  transform(value: any) {
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      if (!Array.isArray(parsed)) {
        throw new Error('Not an array');
      }
      return parsed;
    } catch (e) {
      throw new BadRequestException('Invalid JSON array');
    }
  }
}
