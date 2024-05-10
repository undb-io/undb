import type { IRecordVisitor, RecordDO, StringEqual } from '@undb/table'
import { AbstractQBVisitor } from '../abstract-qb.visitor'

export class RecordFilterVisitor extends AbstractQBVisitor<RecordDO> implements IRecordVisitor {
  stringEqual(spec: StringEqual): void {
    const cond = this.eb.eb(spec.fieldId.value, '=', spec.values.value)
    this.addCond(cond)
  }
}
