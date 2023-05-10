import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../guard';
import { getUser } from '../decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookMarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkservice: BookmarkService) {}

  @Get()
  getBookMarks(@getUser('id') userId: number) {
    return this.bookmarkservice.getBookMarks(userId);
  }

  @Get(':id')
  getBookMarkBId(
    @getUser('id') userId: number,
    @Param('bookmarkid', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkservice.getBookMarkBId(userId, bookmarkId);
  }

  @Post()
  createBookMark(
    @getUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkservice.createBookMark(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  DeleteBookMark(
    @getUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkservice.DeleteBookMark(userId, bookmarkId);
  }

  @Patch(':id')
  editBookMark(
    @getUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    dto: EditBookMarkDto,
  ) {
    return this.bookmarkservice.editBookMark(userId, bookmarkId, dto);
  }
}
