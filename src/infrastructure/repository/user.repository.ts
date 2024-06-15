import { Injectable } from '@nestjs/common';
import { DataSource, In, Not, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from 'src/domain/chat/repository/user.repository';
import { UserModel } from 'src/domain/chat/models/user/user.model';
import { EmailVO } from 'src/domain/chat/value-objects/email.vo';
import { UserStatusActiveEnum } from 'src/const/enums/user/status-active';
import { UserStatusEnum } from 'src/const/enums/user/status';


@Injectable()
export class UserRepository extends Repository<User> implements IUserRepository {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  
  async findById(id: string): Promise<UserModel | null> {
    const user = await this.findOneBy({
      id: id
    });

    return user ? this.mappingUserEntityToModel(user) : null;
  }

  async findByManyIds(ids: string[]): Promise<UserModel[] | null> {
    const users = await this.manager.getRepository(User).find({
      where: {
        id: In(ids)
      }
    })

    return users.length > 0 ? users.map(user => this.mappingUserEntityToModel(user)) : null
  }

  async findUserActive(userId: string): Promise<UserModel | null> {
    const user = await this.manager.getRepository(User).findOne({
      where: [
        {
          id: userId,
          status: Not(
            In([
              UserStatusEnum.BLOCK_MESSAGE,
              UserStatusEnum.CLOSE_ACCOUNT,
              UserStatusEnum.INACTIVE,
            ]),
          ),
        },
        { deleted_at: Not(null) },
      ],
    });

    return user ? this.mappingUserEntityToModel(user) : null
  }

  private mappingUserEntityToModel(user: User): UserModel {
    return new UserModel(
      user.id,
      user.first_name,
      user.last_name,
      new EmailVO(user.email),
      user.organization_id,
      user.type_account,
      user.phone_number,
      user.avatar,
      user.gender,
      user.unit_room_id,
      user.last_activity_at,
      user.status_active == UserStatusActiveEnum.ONLINE,
      user.created_at
    )
  }
}
