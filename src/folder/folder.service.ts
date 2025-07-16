import { Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FolderService {
  constructor(private readonly prisma: DatabaseService) {}
  async createFolder(title: string, authId: string) {
    const user = await this.prisma.user.findUnique({ where: { authId } });

    if (!user) throw new Error('User not found');

    console.log(title);

    return this.prisma.folder.create({
      data: {
        title,
        userId: user.id,
      },
    });
  }

  async getUserFolders(title: string | undefined, authId: string) {
    const user = await this.prisma.user.findUnique({
      where: { authId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const where: any = {
      userId: user.id,
    };

    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive', // optional: makes it case-insensitive
      };
    }

    return this.prisma.folder.findMany({ where });
  }

  async findOne(id: number, authId: string) {
    const user = await this.prisma.user.findUnique({ where: { authId } });

    if (!user) throw new Error('User not found');

    const folder = await this.prisma.folder.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!folder) throw new Error('Folder not found or unauthorized');

    return folder;
  }

  async update(folderId: number, newTitle: string, authId: string) {
    const user = await this.prisma.user.findUnique({ where: { authId } });

    if (!user) throw new Error('User not found');

    // ✅ Only allow update if the folder belongs to the user
    const folder = await this.prisma.folder.findFirst({
      where: { id: folderId, userId: user.id },
    });

    if (!folder) {
      throw new Error('Folder not found or unauthorized');
    }

    return this.prisma.folder.update({
      where: { id: folderId },
      data: { title: newTitle },
    });
  }

  async remove(id: number, authId: string) {
    const user = await this.prisma.user.findUnique({ where: { authId } });
    if (!user) throw new Error('User not found');

    // Check if the folder belongs to the user
    const folder = await this.prisma.folder.findFirst({
      where: { id, userId: user.id },
    });

    if (!folder) {
      throw new Error('Folder not found or unauthorized');
    }

    await this.prisma.file.deleteMany({
      where: {
        folderId: id,
      },
    });
    await this.prisma.folder.delete({ where: { id } });

    return `Folder #${id} has been removed`;
  }
}
