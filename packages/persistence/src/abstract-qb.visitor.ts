import type { ISpecVisitor, ISpecification } from '@undb/domain'
import type { ExpressionBuilder, ExpressionWrapper } from 'kysely'

export interface IAbastractQBVisitor {
  get cond(): ExpressionWrapper<any, any, any>
}

export abstract class AbstractQBVisitor<T> implements IAbastractQBVisitor, ISpecVisitor {
  constructor(protected readonly eb: ExpressionBuilder<any, any>) {}

  #isNot = false
  setIsNot() {
    this.#isNot = true
  }

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
