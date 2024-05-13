import type {
  IRecordVisitor,
  NumberEmpty,
  NumberEqual,
  NumberGT,
  NumberGTE,
  NumberLT,
  NumberLTE,
  RecordDO,
  StringContains,
  StringEmpty,
  StringEndsWith,
  StringEqual,
  StringStartsWith,
} from '@undb/table'
import { AbstractQBVisitor } from '../abstract-qb.visitor'

export class RecordFilterVisitor extends AbstractQBVisitor<RecordDO> implements IRecordVisitor {
  numberEmpty(spec: NumberEmpty): void {
    const cond = this.eb.eb(spec.fieldId.value, 'is', null)
    this.addCond(cond)
  }
  stringEmpty(spec: StringEmpty): void {
    const cond = this.eb.eb(spec.fieldId.value, '=', '').or(spec.fieldId.value, 'is', null)
    this.addCond(cond)
  }
  stringStartsWith(spec: StringStartsWith): void {
    const cond = this.eb.eb(spec.fieldId.value, 'like', `${spec.value}%`)
    this.addCond(cond)
  }
  stringEndsWith(spec: StringEndsWith): void {
    const cond = this.eb.eb(spec.fieldId.value, 'like', `%${spec.value}`)
    this.addCond(cond)
  }
  stringContains(spec: StringContains): void {
    const cond = this.eb.eb(spec.fieldId.value, 'like', `%${spec.value}%`)
    this.addCond(cond)
  }
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
