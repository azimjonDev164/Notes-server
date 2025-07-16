import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FolderModule } from './folder/folder.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [DatabaseModule, FolderModule, AuthModule, UserModule, FileModule, NotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
