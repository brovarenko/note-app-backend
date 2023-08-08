import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotesModule } from './notes/notes.module';
import { Note } from './notes/note.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'mydb',
      models: [Note],
      autoLoadModels: true,
    }),
    NotesModule,
  ],
})
export class AppModule {}
