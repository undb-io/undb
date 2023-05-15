import { CompositeSpecification } from '@undb/domain'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { ViewVO } from '../view.vo.js'

export abstract class BaseViewSpecification extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly view: ViewVO) {
    super()
  }
}
