import type { ISpecification, ISpecVisitor } from '@undb/domain'
import type { IRecordVisitor } from '@undb/table'
import type { StringEqual } from '@undb/table/src/modules/schema/fields/variants/string-field/string-field-value.specification'
import type { ExpressionBuilder, ExpressionWrapper } from 'kysely'

export class RecordFilterVisitor implements IRecordVisitor {
  constructor(private readonly eb: ExpressionBuilder<any, any>) {}

  #conds: ExpressionWrapper<any, any, any>[] = []
  protected addCond(cond: ExpressionWrapper<any, any, any>): void {
    this.#conds.push(cond)
  }
  get cond(): ExpressionWrapper<any, any, any> {
    return this.eb.and(this.#conds)
  }
  stringEqual(spec: StringEqual): void {
    this.addCond(this.eb.eb(spec.fieldId.value, '=', spec.values.value))
  }
  or(left: ISpecification<any, ISpecVisitor>, right: ISpecification<any, ISpecVisitor>): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
