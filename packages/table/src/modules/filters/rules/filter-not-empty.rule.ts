import { DomainRules, ExceptionBase } from '@undb/domain'
import type { Filter } from '../filter.vo'

export class FilterNotEmptyException extends ExceptionBase {
  code = 'table:filter.not.empty'

  constructor() {
    super('Filter should not be empty')
  }
}

export class FilterNotEmptyRule extends DomainRules<FilterNotEmptyException> {
  constructor(readonly filter: Filter) {
    super(new FilterNotEmptyException())
  }

  isBroken(): boolean {
    return this.filter.isEmpty
  }
}
