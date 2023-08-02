import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('stats')
  async getNotesStats() {
    return this.notesService.getNotesStats();
  }

  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Post()
  create(@Body(new ValidationPipe()) createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateNoteDto: CreateNoteDto,
  ) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
