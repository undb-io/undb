import { IQueryUser, User, UserSpecification, type IUserQueryModel, type IUserRepository } from '@egodb/core'
import { Injectable } from '@nestjs/common'
import { InjectUserQueryModel, InjectUserRepository } from './adapters/index.js'

@Injectable()
export class UserService {
  constructor(
    @InjectUserQueryModel() private readonly rm: IUserQueryModel,
    @InjectUserRepository() private readonly repo: IUserRepository,
  ) {}

  async findOneById(id: string): Promise<IQueryUser | undefined> {
    return (await this.rm.findOneById(id)).into()
  }

  async findOne(spec: UserSpecification): Promise<User | undefined> {
    return (await this.repo.findOne(spec)).into()
  }
}
