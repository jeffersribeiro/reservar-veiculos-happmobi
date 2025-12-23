import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { join, extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, unlink, access } from 'fs/promises';

export type UploadResult = {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
};

@Injectable()
export class UploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadFolder();
  }

  private ensureUploadFolder(): void {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private ensureIsImage(file: Express.Multer.File): void {
    if (!file?.mimetype?.startsWith('image/')) {
      throw new BadRequestException(
        `Only images are allowed. Received: ${file?.mimetype ?? 'unknown'}`,
      );
    }
  }

  private genFilename(originalName: string, fieldname = 'file'): string {
    const safeExt = extname(originalName || '').slice(0, 10);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${fieldname}-${unique}${safeExt || ''}`;
  }

  async save(file: Express.Multer.File): Promise<UploadResult> {
    if (!file) throw new BadRequestException('File is required');
    this.ensureIsImage(file);

    if (file.filename && file.path) {
      return {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        url: file.filename,
      };
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException(
        'Invalid file: missing buffer (check multer storage)',
      );
    }

    try {
      const filename = this.genFilename(file.originalname, file.fieldname);
      const fullPath = join(this.uploadDir, filename);
      await writeFile(fullPath, file.buffer);

      return {
        filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        url: filename,
      };
    } catch {
      throw new InternalServerErrorException('Error saving file');
    }
  }

  async saveBatch(files: Express.Multer.File[]): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required');
    }

    for (const f of files) this.ensureIsImage(f);

    return Promise.all(files.map((f) => this.save(f)));
  }

  async delete(filename: string): Promise<void> {
    try {
      const filePath = join(this.uploadDir, filename);

      try {
        await access(filePath);
      } catch {
        return;
      }

      await unlink(filePath);
    } catch {
      throw new InternalServerErrorException('Error deleting file');
    }
  }

  async deleteBatch(filenames: string[]): Promise<void> {
    await Promise.all(filenames.map((name) => this.delete(name)));
  }
}
