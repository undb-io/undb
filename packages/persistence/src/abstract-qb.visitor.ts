import type { ISpecVisitor, ISpecification, Option } from "@undb/domain"
import type { CompiledQuery, Expression, ExpressionBuilder } from "kysely"

type TExpression = Expression<any>

export interface IAbastractQBVisitor {
  get cond(): TExpression
}

export abstract class AbstractQBVisitor<T> implements IAbastractQBVisitor, ISpecVisitor {
  constructor(protected readonly eb: ExpressionBuilder<any, any>) {}

  #isNot = false
  setIsNot(isNot: boolean) {
    this.#isNot = isNot
  }

  #conds: TExpression[] = []
  protected addCond(cond: Expression<any>): void {
    if (this.#isNot) {
      this.#conds.push(this.eb.not(cond))
    } else {
      this.#conds.push(cond)
    }
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

  exec(spec: Option<ISpecification<T, ISpecVisitor>>) {
    if (spec.isSome()) {
      spec.unwrap().accept(this)
    }

    return this.cond
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
    v.setIsNot(true)

    spec.accept(v)

    v.setIsNot(false)
    this.addCond(v.cond)

    return this
  }

  abstract clone(): this
}

export abstract class AbstractQBMutationVisitor implements ISpecVisitor {
  #data: Record<string, any> = {}
  public get data(): Readonly<Record<string, any>> {
    return this.#data
  }

  protected setData(key: string, value: any): void {
    this.#data[key] = value
  }

  #sql: CompiledQuery[] = []
  get sql() {
    return this.#sql
  }

  addSql(...sql: CompiledQuery[]) {
    this.#sql.push(...sql)
  }

  and(left: ISpecification, right: ISpecification): this {
    left.accept(this)
    right.accept(this)
    return this
  }
  or(left: ISpecification, right: ISpecification): this {
    throw new Error("Method not implemented.")
  }
  not(spec: ISpecification): this {
    throw new Error("Method not implemented.")
  }
  clone(): this {
    throw new Error("Method not implemented.")
  }
}
