import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './note.schema';
import { CreateNoteDto } from './dto/note.dto';

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
    const content = createNoteDto.content;
    const dateRegex = /\b\d{1,2}[\.\/]\d{1,2}[\.\/]\d{4}\b/g;
    const datesArray = content.match(dateRegex) || [];

    const createdNote = new this.noteModel({
      ...createNoteDto,
      createdAt: new Date().toISOString(),
      archived: false,
      dates: datesArray,
    });
    return createdNote.save();
  }

  async update(id: string, updateNoteDto: CreateNoteDto): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new BadRequestException('Note not found');
    }

    for (const key in updateNoteDto) {
      if (
        key !== 'createdAt' &&
        key !== 'dates' &&
        updateNoteDto.hasOwnProperty(key)
      ) {
        note[key] = updateNoteDto[key];
      }
    }
    const dateRegex = /\b\d{1,2}[\.\/]\d{1,2}[\.\/]\d{4}\b/g;
    const datesArray = updateNoteDto.content.match(dateRegex) || [];
    note.dates = datesArray;

    return note.save();
  }

  async remove(id: string): Promise<Note> {
    return this.noteModel.findByIdAndRemove(id).exec();
  }

  async getNotesStats(): Promise<
    {
      category: string;
      activeCount: number;
      archivedCount: number;
    }[]
  > {
    const categoryCounts = await this.noteModel.aggregate([
      {
        $group: {
          _id: '$category',
          active: { $sum: { $cond: ['$archived', 0, 1] } },
          archived: { $sum: { $cond: ['$archived', 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          active: 1,
          archived: 1,
        },
      },
    ]);

    return categoryCounts;
  }
}
