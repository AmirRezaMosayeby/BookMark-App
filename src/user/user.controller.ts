import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { getUser } from '../decorator';
import { JwtGuard } from '../guard';
import { UserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch()
  async editUser(
    @getUser('id') userId: number,
    @Body() userDto: UserDto,
  ): Promise<User> {
    return await this.userService.editUser(userId, userDto);
  }
}
