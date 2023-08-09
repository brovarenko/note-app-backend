import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize from 'sequelize';
import { Note } from './note.model';
import { CreateNoteDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note) private readonly noteModel: typeof Note) {}

  async findAll(): Promise<Note[]> {
    return this.noteModel.findAll();
  }

  async findOne(id: number): Promise<Note> {
    return this.noteModel.findByPk(id);
  }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const content = createNoteDto.content;
    const dateRegex = /\b\d{1,2}[\.\/]\d{1,2}[\.\/]\d{4}\b/g;
    const datesArray = content.match(dateRegex) || [];

    return this.noteModel.create({
      ...createNoteDto,
      archived: false,
      dates: datesArray,
    });
  }

  async update(id: number, updateNoteDto: CreateNoteDto): Promise<Note> {
    const note = await this.noteModel.findByPk(id);
    if (!note) {
      throw new BadRequestException('Note not found');
    }

    for (const key in updateNoteDto) {
      if (key !== 'dates' && updateNoteDto.hasOwnProperty(key)) {
        note[key] = updateNoteDto[key];
      }
    }
    const dateRegex = /\b\d{1,2}[\.\/]\d{1,2}[\.\/]\d{4}\b/g;
    const datesArray = updateNoteDto.content.match(dateRegex) || [];
    note.dates = datesArray;

    await note.save();
    return note;
  }

  async remove(id: number): Promise<Note> {
    const note = await this.noteModel.findByPk(id);
    if (!note) {
      throw new BadRequestException('Note not found');
    }

    await note.destroy();
    return note;
  }

  async getNotesStats(): Promise<
    {
      category: string;
      activeCount: number;
      archivedCount: number;
    }[]
  > {
    const categoryCounts: any = await this.noteModel.findAll({
      attributes: [
        'category',
        [
          sequelize.literal('SUM(CASE WHEN archived = true THEN 1 ELSE 0 END)'),
          'archivedCount',
        ],
        [
          sequelize.literal(
            'SUM(CASE WHEN archived = false THEN 1 ELSE 0 END)',
          ),
          'activeCount',
        ],
      ],
      group: ['category'],
    });

    return categoryCounts;
  }
}
