import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { unlink } from 'fs/promises';
import { diskStorage } from 'multer';
import { join, normalize } from 'path';

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export function imageUpload(folder: string): MulterOptions {
  return {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (EXTENSIONS[file.mimetype]) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Solo se admiten imágenes JPG, PNG, WebP o GIF'), false);
      }
    },
    storage: diskStorage({
      destination: `./uploads/${folder}`,
      filename: (_req, file, cb) => {
        cb(null, `${randomUUID()}${EXTENSIONS[file.mimetype]}`);
      },
    }),
  };
}

// Las imágenes del seed viven en el frontend (assets/...) y no se tocan
export async function removeUpload(url?: string | null) {
  if (!url?.startsWith('/uploads/')) {
    return;
  }
  const relative = normalize(url.slice(1));
  await unlink(join(process.cwd(), relative)).catch(() => undefined);
}
