export class CreateNoteDto {
  name: string;
  content: string;
  category: string;
}

export class UpdateNoteDto {
  name?: string;
  content?: string;
  category?: string;
}
