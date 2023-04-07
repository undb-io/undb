import type { IQueryUser, IUserQueryModel, UserSpecification } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { User } from '../../entity/user.js'
import { UserSqliteMapper } from './user-sqlite.mapper.js'

export class UserSqliteQueryModel implements IUserQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async findOneById(id: string): Promise<Option<IQueryUser>> {
    const user = await this.em.findOne(User, id)
    if (!user) {
      return None
    }
    return Some(UserSqliteMapper.toQuery(user))
  }

  findOne(spec: UserSpecification): Promise<Option<IQueryUser>> {
    throw new Error('not implemented')
  }
}
