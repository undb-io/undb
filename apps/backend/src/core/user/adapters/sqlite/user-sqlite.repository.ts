import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
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

  @CreateRequestContext()
  exists(spec: UserSpecification): Promise<boolean> {
    return super.exists(spec)
  }

  @CreateRequestContext()
  insert(user: User): Promise<void> {
    return super.insert(user)
  }

  @CreateRequestContext()
  findOneById(id: string): Promise<Option<User>> {
    return super.findOneById(id)
  }

  @CreateRequestContext()
  findOne(spec: UserSpecification): Promise<Option<User>> {
    return super.findOne(spec)
  }

  @CreateRequestContext()
  count(spec: UserSpecification | null): Promise<number> {
    return super.count(spec)
  }

  @CreateRequestContext()
  updateOneById(id: string, spec: UserSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }
}
