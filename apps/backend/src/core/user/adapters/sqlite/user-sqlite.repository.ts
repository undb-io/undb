import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { User, type UserSpecification } from '@undb/core'
import { EntityManager, UserSqliteRepository } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

@Injectable()
export class NestUserSqliteRepository extends UserSqliteRepository {
  constructor(
    protected readonly orm: MikroORM,
    em: EntityManager,
  ) {
    super(em)
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

  @UseRequestContext()
  count(spec: UserSpecification | null): Promise<number> {
    return super.count(spec)
  }

  @UseRequestContext()
  updateOneById(id: string, spec: UserSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }
}
