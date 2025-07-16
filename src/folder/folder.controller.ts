import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('folder')
@UseGuards(JwtAuthGuard)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  create(@Body() body, @Req() req) {
    return this.folderService.createFolder(body.title, req.user.sub);
  }

  @Get()
  async getAll(@Query('title') title: string, @Req() req: any) {
    const folders = await this.folderService.getUserFolders(
      title,
      req.user.sub,
    );
    return folders;
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.folderService.findOne(+id, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // ✅ Secure the route
  update(@Param('id') id: string, @Body() body, @Req() req) {
    return this.folderService.update(+id, body.title, req.user.sub); // ✅ send authId
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.folderService.remove(+id, req.user.sub);
  }
}
