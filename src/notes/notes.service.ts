import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: DatabaseService) {}

  // ✅ Create a new note and return it, connecting to a file
  async create(createNoteDto: CreateNoteDto) {
    const { content, type, completed, fileId } = createNoteDto;

    return await this.prisma.note.create({
      data: {
        content,
        type,
        completed,
        file: {
          connect: {
            id: +fileId,
          },
        },
      },
      include: {
        file: true, // ✅ optional: return related file
      },
    });
  }

  // ✅ Find all notes, optionally throw if none found
  async findAll(fileId: number) {
    const notes = await this.prisma.note.findMany({
      where: {
        fileId,
      }
    });

    if (notes.length === 0) {
      throw new NotFoundException('No notes found');
    }

    return notes;
  }

  // ✅ Find one note by ID, throw if not found
  async findOne(id: number) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        file: true,
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  // ✅ Update note, return updated note
  async update(id: number, updateNoteDto: UpdateNoteDto) {
    const existingNote = await this.prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return await this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
      include: {
        file: true,
      },
    });
  }

  // ✅ Delete note by ID, throw if not found
  async remove(id: number) {
    const existingNote = await this.prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return await this.prisma.note.delete({
      where: { id },
    });
  }
}
