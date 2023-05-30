/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { AbstractFieldTypeHandler, type Field, type IFieldType, type IFieldTypeHandler } from '@undb/core'
import { Mixin } from 'ts-mixer'
import { BaseEntityManager } from '../../repository/base-entity-manager.js'

export abstract class BaseColumnTypeModifier<F extends Field>
  extends Mixin(AbstractFieldTypeHandler, BaseEntityManager)
  implements IFieldTypeHandler
{
  constructor(
    protected readonly field: F,
    protected readonly tableId: string,
    protected readonly newType: IFieldType,
    em: EntityManager,
    protected readonly knex: Knex,
  ) {
    super(em)
  }

  id(): void {
    throw new Error('Method not implemented.')
  }
  ['created-at'](): void {
    throw new Error('Method not implemented.')
  }
  ['created-by'](): void {
    throw new Error('Method not implemented.')
  }
  ['updated-at'](): void {
    throw new Error('Method not implemented.')
  }
  ['updated-by'](): void {
    throw new Error('Method not implemented.')
  }
  ['auto-increment'](): void {
    throw new Error('Method not implemented.')
  }
}
