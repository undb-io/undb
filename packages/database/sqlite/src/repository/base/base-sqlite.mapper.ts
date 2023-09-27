import type { Base as CoreBase, IQueryBase } from '@undb/core'
import { BaseFactory, WithBaseId, WithBaseName } from '@undb/core'
import type { Base } from '../../entity/base.js'

export class BaseSqliteMapper {
  static toQuery(base: Base): IQueryBase {
    return {
      id: base.id,
      name: base.name,
    }
  }

  static toDomain(user: Base): CoreBase {
    return BaseFactory.create(WithBaseId.fromString(user.id), WithBaseName.fromString(user.name))
  }
}
