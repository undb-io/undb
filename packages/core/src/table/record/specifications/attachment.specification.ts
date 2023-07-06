import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { AttachmentFieldValue } from '../../field'
import type { IAttachmentFilterTypeValue } from '../../field/fields/attachment/attachment.filter'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'
import { BaseRecordQuerySpecification } from './record-specification.base'

export class HasFileType extends BaseRecordQuerySpecification<IAttachmentFilterTypeValue> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)

    return value instanceof AttachmentFieldValue && value.hasFileType(this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.hasFileType(this)
    return Ok(undefined)
  }
}

export class IsAttachmentEmpty extends BaseRecordQuerySpecification<void> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)

    return value instanceof AttachmentFieldValue && value.isEmpty()
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.isAttachmentEmpty(this)
    return Ok(undefined)
  }
}

export class HasExtension extends BaseRecordQuerySpecification<string[]> {
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)

    return value instanceof AttachmentFieldValue && value.hasExtension(this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.hasExtension(this)
    return Ok(undefined)
  }
}
