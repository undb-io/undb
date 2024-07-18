import { type ISpecVisitor, type ISpecification } from "@undb/domain"
import { and, not, or, type SQL } from "drizzle-orm"
import type { SQLiteSelectQueryBuilder, SQLiteTable, SQLiteUpdateSetSource } from "drizzle-orm/sqlite-core"

export interface IAbastractDBFilterVisitor {
  get cond(): SQL | undefined
}

export abstract class AbstractDBFilterVisitor<T> implements IAbastractDBFilterVisitor, ISpecVisitor {
  constructor(public sb?: SQLiteSelectQueryBuilder) {}

  #conds: (SQL | undefined)[] = []

  protected addCond(cond: SQL | undefined) {
    this.#conds.push(cond)
  }

  #isNot = false
  setIsNot() {
    this.#isNot = true
  }

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

  and(left: ISpecification<T, ISpecVisitor>, right: ISpecification<T, ISpecVisitor>): this {
    const lv = this.clone()
    left.accept(lv)

    const rv = this.clone()
    right.accept(rv)

    this.addCond(and(lv.cond!, rv.cond!))

    return this
  }

  or(left: ISpecification<T, ISpecVisitor>, right: ISpecification<T, ISpecVisitor>): this {
    const lv = this.clone()
    left.accept(lv)

    const rv = this.clone()
    right.accept(rv)

    this.addCond(or(lv.cond!, rv.cond!))

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
    const Visitor = Object.getPrototypeOf(this).constructor as new () => AbstractDBFilterVisitor<T>
    return new Visitor() as this
  }
}

type Source<T extends SQLiteTable> = SQLiteUpdateSetSource<T>

export interface IAbastractDBMutationVisitor<T extends SQLiteTable> {
  get updates(): Source<T>
}
