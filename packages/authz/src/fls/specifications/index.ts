import type { IFLSAction } from '../value-objects/fls-policy.vo.js'
import { WithFLSAction, WithFLSActionIn } from './fls-policy.specification.js'
import { WithFLSTableId } from './fls-table-id.specification.js'

export * from './fls-field-id.specification.js'
export * from './fls-id.specification.js'
export * from './fls-policy.specification.js'
export * from './fls-subject.specification.js'
export * from './fls-table-id.specification.js'

export const withTableFLS = (tableId: string) => WithFLSTableId.fromString(tableId)

export const withTableOfActionFLS = (action: IFLSAction | [IFLSAction, ...IFLSAction[]], tableId: string) =>
  withTableFLS(tableId).and(Array.isArray(action) ? new WithFLSActionIn(action) : new WithFLSAction(action))
