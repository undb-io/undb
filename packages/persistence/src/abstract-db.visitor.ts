import type { ISpecVisitor, ISpecification } from '@undb/domain'
import { and, not, or, type SQL } from 'drizzle-orm'

export interface IAbastractDBVisitor {
  get cond(): SQL | undefined
}

export abstract class AbstractDBVisitor<T> implements IAbastractDBVisitor, ISpecVisitor {
  #conds: (SQL | undefined)[] = []

  protected addCond(cond: SQL | undefined) {
    this.#conds.push(cond)
  }

  #isNot = false

  get cond(): SQL | undefined {
    const cond = and(...this.#conds)
    if (!cond) {
      return undefined
    }

    if (this.#isNot) {
      return not(cond)
    }

    return and(cond)
  }

  or(left: ISpecification<T, ISpecVisitor>, right: ISpecification<T, ISpecVisitor>): this {
    const Visitor = Object.getPrototypeOf(this).constructor as new () => AbstractDBVisitor<T>

    const lv = new Visitor()
    left.accept(lv)

    const rv = new Visitor()
    right.accept(rv)

    this.addCond(or(lv.cond!, rv.cond!))

    return this
  }

  not(): this {
    this.#isNot = true
    return this
  }
}
