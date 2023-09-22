import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { Base } from './base.js'
import type { WithBaseId } from './specifications/base-id.specification.js'
import type { WithBaseName } from './specifications/base-name.specification.js'

export interface IBaseVisitor extends ISpecVisitor {
  withId(v: WithBaseId): void
  withName(v: WithBaseName): void
}

export type BaseSpecification = CompositeSpecification<Base, IBaseVisitor>
