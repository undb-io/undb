import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { FieldId } from '../../field/index.js'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { ViewVO } from '../view.vo.js'
import { BaseViewSpecification } from './base-view-specification.js'

export class WithGalleryField extends BaseViewSpecification {
  constructor(public readonly view: ViewVO, public readonly fieldId: FieldId | null) {
    super(view)
  }

  isSatisfiedBy(): boolean {
    return this.view.galleryFieldId.mapOr(false, (fieldId) => !!this.fieldId && fieldId.equals(this.fieldId))
  }

  mutate(t: Table): Result<Table, string> {
    this.view.getOrCreateGallery().fieldId = this.fieldId ?? undefined
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.galleryFieldEqual(this)
    return Ok(undefined)
  }
}
