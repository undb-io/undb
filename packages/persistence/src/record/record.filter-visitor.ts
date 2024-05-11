import type {
  IRecordVisitor,
  NumberEqual,
  NumberGT,
  NumberGTE,
  NumberLT,
  NumberLTE,
  RecordDO,
  StringEqual,
} from '@undb/table'
import { AbstractQBVisitor } from '../abstract-qb.visitor'

export class RecordFilterVisitor extends AbstractQBVisitor<RecordDO> implements IRecordVisitor {
  numberGT(spec: NumberGT): void {
    const cond = this.eb.eb(spec.fieldId.value, '>', spec.value)
    this.addCond(cond)
  }
  numberGTE(spec: NumberGTE): void {
    const cond = this.eb.eb(spec.fieldId.value, '>=', spec.value)
    this.addCond(cond)
  }
  numberLT(spec: NumberLT): void {
    const cond = this.eb.eb(spec.fieldId.value, '<', spec.value)
    this.addCond(cond)
  }
  numberLTE(spec: NumberLTE): void {
    const cond = this.eb.eb(spec.fieldId.value, '<=', spec.value)
    this.addCond(cond)
  }
  numberEqual(spec: NumberEqual): void {
    const cond = this.eb.eb(spec.fieldId.value, '=', spec.values.value)
    this.addCond(cond)
  }
  stringEqual(spec: StringEqual): void {
    const cond = this.eb.eb(spec.fieldId.value, '=', spec.values.value)
    this.addCond(cond)
  }
}
