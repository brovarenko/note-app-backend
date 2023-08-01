export class CreateNoteDto {
  name: string;
  createdAt: Date;
  content: string;
  category: string;
  dates: string[];
  archived: boolean;
}

export class UpdateNoteDto {
  name?: string;
  createdAt?: Date;
  content?: string;
  category?: string;
  dates?: string[];
}
