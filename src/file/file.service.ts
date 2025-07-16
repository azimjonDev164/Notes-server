import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FileService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(folderId: number, title: string) {
    const existingFile = await this.prisma.file.findUnique({
      where: { title },
    });

    if (existingFile) {
      throw new ConflictException('File with this title already exists.');
    }

    return this.prisma.file.create({
      data: { folderId, title },
    });
  }

  async findAll(folderId: number) {
    return this.prisma.file.findMany({
      where: { folderId },
    }); 
  }

  async findOne(id: number) {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async update(id: number, newtitle: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return this.prisma.file.update({
      where: { id },
      data: { title: newtitle },
    });
  }

  async remove(id: number) {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.prisma.file.delete({ where: { id } }); // ✅ fixed

    return `File #${id} has been removed`;
  }
}
