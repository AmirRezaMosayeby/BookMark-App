import { ForbiddenException, Injectable } from '@nestjs/common';
// import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      // delete user.hash;
      // return user;

      return this.signtoken(user.id, user.email);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('credentials taken!');
        }
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('user does not exist');
    const pasMatches = await argon.verify(user.hash, dto.password);
    console.log(pasMatches);
    if (!pasMatches) throw new ForbiddenException('user does not exist');

    // delete user.hash;
    // return user;

    return this.signtoken(user.id, user.email);
  }

  async signtoken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payLoad = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payLoad, {
      expiresIn: '1h',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
