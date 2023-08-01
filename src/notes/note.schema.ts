import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop()
  name: string;

  @Prop()
  createdAt: Date;

  @Prop()
  content: string;

  @Prop()
  category: string;

  @Prop([String])
  dates: string[];

  @Prop()
  archived: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
