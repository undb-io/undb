import { Injectable } from '@nestjs/common'
import { type ConfigType } from '@nestjs/config'
import { CommandBus } from '@nestjs/cqrs'
import type { IQueryUser, User, UserSpecification } from '@undb/core'
import { WithUserEmail, type IUserQueryModel, type IUserRepository } from '@undb/core'
import { RegisterCommand } from '@undb/cqrs'
import bcrypt from 'bcrypt'
import type { authConfig } from '../../configs/auth.config.js'
import { InjectAuthConfig } from '../../configs/auth.config.js'
import { InjectUserQueryModel, InjectUserRepository } from './adapters/index.js'

@Injectable()
export class UserService {
  constructor(
    @InjectUserQueryModel() private readonly rm: IUserQueryModel,
    @InjectUserRepository() private readonly repo: IUserRepository,
    @InjectAuthConfig() private readonly config: ConfigType<typeof authConfig>,
    private readonly commandBus: CommandBus,
  ) {}

  async createAdmin() {
    const { admin } = this.config
    if (admin.email && admin.password) {
      const hashedPassword = await bcrypt.hash(admin.password, 10)

      const email = WithUserEmail.fromString(admin.email)
      const exists = await this.repo.exists(email)
      if (exists) return

      await this.commandBus.execute(
        new RegisterCommand({
          email: admin.email,
          password: hashedPassword,
        }),
      )
    }
  }

  async findOneById(id: string): Promise<IQueryUser | undefined> {
    return (await this.rm.findOneById(id)).into()
  }

  async findOne(spec: UserSpecification): Promise<User | undefined> {
    return (await this.repo.findOne(spec)).into()
  }
}
