import { Controller, Get, Param, Req } from '@nestjs/common';
import { IUserRepository } from 'src/domain/chat/repository/user.repository';
import { UseGuards } from '@nestjs/common';
import { OrganiztionGuard } from '../guard/organization.guard';

@Controller()
export class MessageController {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  @UseGuards(OrganiztionGuard)
  @Get('/message/:id')
  async findById(@Param('id') id: string, @Req() req) {
    const test = await this.userRepository.findById(id);
    return test;
  }
}
