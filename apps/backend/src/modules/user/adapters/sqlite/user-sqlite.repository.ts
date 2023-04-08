import { User, type UserSpecification } from '@egodb/core'
import { EntityManager, UserSqliteRepository } from '@egodb/sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { Option } from 'oxide.ts'

@Injectable()
export class NestUserSqliteRepository extends UserSqliteRepository {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @UseRequestContext()
  exists(spec: UserSpecification): Promise<boolean> {
    return super.exists(spec)
  }

  @UseRequestContext()
  insert(user: User): Promise<void> {
    return super.insert(user)
  }

  @UseRequestContext()
  findOneById(id: string): Promise<Option<User>> {
    return super.findOneById(id)
  }

  @UseRequestContext()
  findOne(spec: UserSpecification): Promise<Option<User>> {
    return super.findOne(spec)
  }
}
