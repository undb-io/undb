import { CompositeSpecification } from '@undb/domain'
import { sample } from 'lodash-es'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IColor } from '../../common/color.js'
import { colors, colorsSchema } from '../../common/color.js'
import type { User } from '../user.js'
import type { IUserSpecVisitor } from './interface.js'

export class WithUserColor extends CompositeSpecification<User, IUserSpecVisitor> {
  constructor(public readonly color: IColor) {
    super()
  }

  static fromString(color: string): WithUserColor {
    return new WithUserColor(colorsSchema.parse(color))
  }

  static random(): WithUserColor {
    const color = sample(colors) ?? 'blue'
    return new WithUserColor(color)
  }

  isSatisfiedBy(t: User): boolean {
    return this.color === t.color
  }

  mutate(t: User): Result<User, string> {
    t.color = this.color
    return Ok(t)
  }

  accept(v: IUserSpecVisitor): Result<void, string> {
    v.colorEqual(this)
    return Ok(undefined)
  }
}
