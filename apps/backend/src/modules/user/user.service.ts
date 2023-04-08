import {
  IQueryUser,
  User,
  UserFactory,
  UserSpecification,
  WithUserEmail,
  WithUserId,
  WithUserPassword,
  WithUsername,
  type IUserQueryModel,
  type IUserRepository,
} from '@egodb/core'
import { Injectable } from '@nestjs/common'
import { type ConfigType } from '@nestjs/config'
import { InjectAuthConfig, authConfig } from '../../configs/auth.config.js'
import { InjectUserQueryModel, InjectUserRepository } from './adapters/index.js'

@Injectable()
export class UserService {
  constructor(
    @InjectUserQueryModel() private readonly rm: IUserQueryModel,
    @InjectUserRepository() private readonly repo: IUserRepository,
    @InjectAuthConfig() private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async createAdmin() {
    const { admin } = this.config
    if (admin.email && admin.password) {
      const email = WithUserEmail.fromString(admin.email)
      const exists = await this.repo.exists(email)
      if (exists) return

      const user = UserFactory.create(
        email,
        WithUserPassword.fromString(admin.password),
        admin.username ? WithUsername.fromString(admin.username) : WithUsername.fromEmail(admin.email),
        WithUserId.create(),
      )
      await this.repo.insert(user)
    }
  }

  async findOneById(id: string): Promise<IQueryUser | undefined> {
    return (await this.rm.findOneById(id)).into()
  }

  async findOne(spec: UserSpecification): Promise<User | undefined> {
    return (await this.repo.findOne(spec)).into()
  }
}
