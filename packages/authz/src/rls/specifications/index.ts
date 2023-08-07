import type { IRLSAction } from '../value-objects/rls-policy.vo.js'
import { WithRLSAction, WithRLSActionIn } from './rls-policy.specification.js'
import { RLSSubjectContainsUser } from './rls-subject.specification.js'
import { WithRLSTableId } from './rls-table-id.specification.js'

export * from './rls-id.specification.js'
export * from './rls-policy.specification.js'
export * from './rls-subject.specification.js'
export * from './rls-table-id.specification.js'

export const withTableRLS = (tableId: string) => WithRLSTableId.fromString(tableId)

export const withTableOfActionRLS = (action: IRLSAction | [IRLSAction, ...IRLSAction[]], tableId: string) =>
  withTableRLS(tableId).and(Array.isArray(action) ? new WithRLSActionIn(action) : new WithRLSAction(action))

export const isUserMatch = (userId: string) => new RLSSubjectContainsUser(userId)
