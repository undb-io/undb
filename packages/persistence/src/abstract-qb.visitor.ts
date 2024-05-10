import type { ISpecVisitor, ISpecification } from '@undb/domain'
import type { ExpressionBuilder, ExpressionWrapper } from 'kysely'

export interface IAbastractQBVisitor {
  get cond(): ExpressionWrapper<any, any, any>
}

export abstract class AbstractQBVisitor<T> implements IAbastractQBVisitor, ISpecVisitor {
  constructor(protected readonly eb: ExpressionBuilder<any, any>) {}

  #isNot = false

  #conds: ExpressionWrapper<any, any, any>[] = []
  protected addCond(cond: ExpressionWrapper<any, any, any>): void {
    this.#conds.push(cond)
  }
  get cond(): ExpressionWrapper<any, any, any> {
    if (this.#isNot) {
      return this.eb.not(this.eb.and(this.#conds))
    }

    return this.eb.and(this.#conds)
  }
  or(left: ISpecification<T, ISpecVisitor>, right: ISpecification<T, ISpecVisitor>): this {
    const Visitor = Object.getPrototypeOf(this).constructor

    const lv = new Visitor(this.eb)
    left.accept(lv)

    const rv = new Visitor(this.eb)
    right.accept(rv)

    const cond = this.eb.or([lv.cond, rv.cond])
    this.addCond(cond)

    return this
  }

  not(): this {
    this.#isNot = true
    return this
  }
}
