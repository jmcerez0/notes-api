import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotesService } from './notes.service';
import { Note } from './schemas/note.schema';
import { NoteEntity } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('notes')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: NoteEntity })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @Req() req: any,
  ): Promise<Note> {
    return await this.notesService.createNote(createNoteDto, req.user);
  }

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: NoteEntity, isArray: true })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  @ApiQuery({ name: 'keyword', type: String, required: false })
  async getAllNotes(@Req() req: any, @Query() query: any): Promise<Note[]> {
    return await this.notesService.getAllNotes(req.user._id, query);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: NoteEntity })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  async getNoteById(@Param('id') id: string): Promise<Note> {
    return await this.notesService.getNoteById(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: NoteEntity })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return await this.notesService.updateNote(id, updateNoteDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: NoteEntity })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  async deleteNote(@Param('id') id: string): Promise<Note> {
    return await this.notesService.deleteNote(id);
  }
}
