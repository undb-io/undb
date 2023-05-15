import { ValueObject } from '@undb/domain'
import type { ILayoutSchema } from './layout.type.js'

export class LayoutVO extends ValueObject<ILayoutSchema> {
  public get x() {
    return this.props.x
  }
  public get y() {
    return this.props.y
  }
  public get h() {
    return this.props.h
  }
  public get w() {
    return this.props.w
  }

  public toJSON() {
    return {
      x: this.x,
      y: this.y,
      h: this.h,
      w: this.w,
    }
  }
}
