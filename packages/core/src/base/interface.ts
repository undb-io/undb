import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import type { Base } from './base.js'
import type { WithBaseId } from './specifications/base-id.specification.js'
import type { WithBaseName } from './specifications/base-name.specification.js'
import type { WithBaseQ } from './specifications/base-q.specification.js'

export interface IBaseSpecVisitor extends ISpecVisitor {
  withId(v: WithBaseId): void
  withName(v: WithBaseName): void
  withQ(v: WithBaseQ): void
}

export type BaseSpecification = CompositeSpecification<Base, IBaseSpecVisitor>
