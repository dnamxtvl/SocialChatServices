import { Controller, Get, Param } from '@nestjs/common';
import { IUserRepository } from 'src/domain/chat/repository/user.repository';

@Controller()
export class MessageController {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  @Get('/message/:id')
  async findById(@Param('id') id: string) {
    const test = await this.userRepository.findById(id);
    console.log(test);
    return test;
  }
}
