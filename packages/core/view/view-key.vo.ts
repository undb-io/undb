import { ValueObject } from '@egodb/domain'
import { z } from 'zod'
import type { ViewName } from './view-name.vo.js'

export const viewKeySchema = z.string().min(1)

export class ViewKey extends ValueObject<string> {
  public get value() {
    return this.props.value
  }

  static fromName(viewName: ViewName) {
    return new this({ value: viewName.value })
  }

  static create(id: string) {
    return new this({ value: id })
  }
}
