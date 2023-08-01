import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './note.schema';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
  ) {}

  async findAll(): Promise<Note[]> {
    return this.noteModel.find().exec();
  }

  async findOne(id: string): Promise<Note> {
    return this.noteModel.findById(id).exec();
  }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const createdNote = new this.noteModel({
      ...createNoteDto,
      createdAt: new Date().toISOString(),
      archived: false,
      dates: [],
    });
    return createdNote.save();
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new BadRequestException('Note not found');
    }

    for (const key in updateNoteDto) {
      if (updateNoteDto.hasOwnProperty(key)) {
        note[key] = updateNoteDto[key];
      }
    }

    return note.save();
  }

  async remove(id: string): Promise<Note> {
    return this.noteModel.findByIdAndRemove(id).exec();
  }
}
