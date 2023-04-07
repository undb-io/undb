import { IQueryUser, UserSpecification, type IUserQueryModel } from '@egodb/core'
import { Injectable } from '@nestjs/common'
import { InjectUserQueryModel } from './adapters/index.js'

@Injectable()
export class UserService {
  constructor(@InjectUserQueryModel() private readonly rm: IUserQueryModel) {}

  async findOneById(id: string): Promise<IQueryUser | undefined> {
    return (await this.rm.findOneById(id)).into()
  }

  async findOne(spec: UserSpecification): Promise<IQueryUser | undefined> {
    return (await this.rm.findOne(spec)).into()
  }
}
