import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserModel } from 'src/domain/chat/models/user/user.model';
import { UserBlock } from '../entities/user-block.entity';
import { IUserBlockRepository } from 'src/domain/chat/repository/user-block.repository';
import { UserBlockModel } from 'src/domain/chat/models/user/user-block.model';


@Injectable()
export class UserBlockRepository extends Repository<UserBlock> implements IUserBlockRepository {
  constructor(private dataSource: DataSource) {
    super(UserBlock, dataSource.createEntityManager());
  }

  async findByUserId(userId: string): Promise<UserBlockModel[] | null> {
    const listUserBlock = await this.findBy({
      user_id: userId,
    });

    return listUserBlock
      ? listUserBlock.map(userBlock => this.mappingUserBlockEntityToModel(userBlock))
      : null;
  }

  async isUserBlocked(user: UserModel, blockedUserId: string): Promise<boolean> {
    const listUserBlock = await this.findOneBy({
      user_id: user.getId(),
      blocked_user_id: blockedUserId
    });

    return listUserBlock
      ? true
      : false;
  }

  private mappingUserBlockEntityToModel(userBlock: UserBlock): UserBlockModel {
    return new UserBlockModel(
      userBlock.id,
      userBlock.user_id,
      userBlock.blocked_user_id,
      userBlock.created_at,
    );
  }
}
