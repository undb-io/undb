import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { Base } from './base.js'
import type { WithBaseId } from './specifications/base-id.specification.js'

export interface IBaseVisitor extends ISpecVisitor {
  withId(v: WithBaseId): void
}

export type BaseSpecification = CompositeSpecification<Base, IBaseVisitor>
