import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookMarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookMarks(userId: number) {
    return await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }
  async getBookMarkBId(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookMark(userId: number, dto: any) {
    return await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
  }
  async DeleteBookMark(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId === userId) {
      throw new ForbiddenException('access to resources denied.');
    }

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }

  //   async updateBookMark() {}
  async editBookMark(userId: number, bookmarkId: number, dto: EditBookMarkDto) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId === userId) {
      throw new ForbiddenException('access to resources denied.');
    }

    await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        userId,
        ...dto,
      },
    });
  }
}
