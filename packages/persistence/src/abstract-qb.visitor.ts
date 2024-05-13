import type { ISpecVisitor, ISpecification } from '@undb/domain'
import type { Expression, ExpressionBuilder } from 'kysely'

type TExpression = Expression<any>

export interface IAbastractQBVisitor {
  get cond(): TExpression
}

export abstract class AbstractQBVisitor<T> implements IAbastractQBVisitor, ISpecVisitor {
  constructor(protected readonly eb: ExpressionBuilder<any, any>) {}

  #isNot = false
  setIsNot() {
    this.#isNot = true
  }

  #conds: TExpression[] = []
  protected addCond(cond: Expression<any>): void {
    this.#conds.push(cond)
  }
  get cond(): TExpression {
    const conds = this.#conds
    if (!conds.length) {
      return this.eb.and([])
    }

    let cond: TExpression | undefined
    if (conds.length === 1) {
      cond = conds[0]
    } else {
      cond = this.eb.and(conds)
    }
    if (this.#isNot) {
      return this.eb.not(cond)
    }

    return cond
  }

  and(left: ISpecification<T, ISpecVisitor>, right: ISpecification<T, ISpecVisitor>): this {
    const lv = this.clone()
    left.accept(lv)

    const rv = this.clone()
    right.accept(rv)

    const cond = this.eb.and([lv.cond, rv.cond])
    this.addCond(cond)

    return this
  }

  or(left: ISpecification<T, ISpecVisitor>, right: ISpecification<T, ISpecVisitor>): this {
    const lv = this.clone()
    left.accept(lv)

    const rv = this.clone()
    right.accept(rv)

    const cond = this.eb.or([lv.cond, rv.cond])
    this.addCond(cond)

    return this
  }

  not(spec: ISpecification<T, ISpecVisitor>): this {
    const v = this.clone()
    v.setIsNot()

    spec.accept(v)
    this.addCond(v.cond)

    return this
  }

  clone(): this {
    const Visitor = Object.getPrototypeOf(this).constructor
    return new Visitor(this.eb)
  }
}
