import { Injectable } from '@nestjs/common'
import type { IQueryUser, User, UserSpecification } from '@undb/core'
import { type IUserQueryModel, type IUserRepository } from '@undb/core'
import { InjectUserQueryModel, InjectUserRepository } from './adapters/index.js'

@Injectable()
export class UserService {
  constructor(
    @InjectUserQueryModel() private readonly rm: IUserQueryModel,
    @InjectUserRepository() private readonly repo: IUserRepository,
  ) {}

  async insert(user: User): Promise<void> {
    return this.repo.insert(user)
  }

  async findOneById(id: string): Promise<IQueryUser | undefined> {
    return (await this.rm.findOneById(id)).into()
  }

  async findOne(spec: UserSpecification): Promise<User | undefined> {
    return (await this.repo.findOne(spec)).into()
  }

  async exists(spec: UserSpecification): Promise<boolean> {
    return this.repo.exists(spec)
  }
}
