import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Note } from './schemas/note.schema';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async createNote(note: Note, user: User): Promise<Note> {
    const data = Object.assign(note, { user: user._id });

    const createdNote = await this.noteModel.create(data);

    return createdNote;
  }

  async getAllNotes(user_id: string, query: any): Promise<Note[]> {
    const keyword = query.keyword
      ? {
          $or: [
            {
              title: {
                $regex: query.keyword,
                $options: 'i',
              },
            },
            {
              content: {
                $regex: query.keyword,
                $options: 'i',
              },
            },
          ],
        }
      : {};

    const notes = await this.noteModel
      .find({ ...keyword })
      .where('user')
      .equals(user_id)
      .sort({ createdAt: -1 });

    return notes;
  }

  async getNoteById(id: string): Promise<Note> {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter a valid id.');
    }

    const note = await this.noteModel.findById(id);

    if (!note) {
      throw new NotFoundException('Note does not exist.');
    }

    return note;
  }

  async updateNote(id: string, note: Note): Promise<Note> {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter a valid id.');
    }

    const updatedNote = await this.noteModel.findByIdAndUpdate(id, note, {
      new: true,
    });

    if (!updatedNote) {
      throw new NotFoundException('Note does not exist.');
    }

    return updatedNote;
  }

  async deleteNote(id: string): Promise<Note> {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter a valid id.');
    }

    const deletedNote = await this.noteModel.findByIdAndDelete(id, {
      new: true,
    });

    if (!deletedNote) {
      throw new NotFoundException('Note does not exist.');
    }

    return deletedNote;
  }
}
