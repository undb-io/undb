import type { IRecordVisitor,NumberEqual,RecordDO,StringEqual } from '@undb/table'
import { AbstractQBVisitor } from '../abstract-qb.visitor'

export class RecordFilterVisitor extends AbstractQBVisitor<RecordDO> implements IRecordVisitor {
  numberEqual(spec: NumberEqual): void {
    const cond = this.eb.eb(spec.fieldId.value, '=', spec.values.value)
    this.addCond(cond)
  }
  stringEqual(spec: StringEqual): void {
    const cond = this.eb.eb(spec.fieldId.value, '=', spec.values.value)
    this.addCond(cond)
  }
}
