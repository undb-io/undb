import { IQueryUser, type IUserQueryModel } from '@egodb/core'
import { Injectable } from '@nestjs/common'
import { InjectUserQueryModel } from './adapters/index.js'

@Injectable()
export class UserService {
  constructor(@InjectUserQueryModel() private readonly rm: IUserQueryModel) {}

  async findOne(id: string): Promise<IQueryUser | undefined> {
    return (await this.rm.findOneById(id)).into()
  }
}
