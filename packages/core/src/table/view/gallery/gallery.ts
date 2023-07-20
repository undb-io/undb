import { ValueObject } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { FieldId } from '../../field/index.js'
import type { IGallerySchema } from './gallery.schema.js'
import type { IGallery } from './gallery.type.js'

export class Gallery extends ValueObject<IGallery> {
  static from(input: IGallerySchema) {
    return new this({
      fieldId: input.fieldId ? FieldId.fromString(input.fieldId) : undefined,
    })
  }

  public get fieldId() {
    return this.props.fieldId
  }

  public set fieldId(fieldId: FieldId | undefined) {
    this.props.fieldId = fieldId
  }

  public removeField(fieldId: FieldId): Option<Gallery> {
    if (this.fieldId?.equals(fieldId)) {
      const gallery = new Gallery({ ...this, fieldId: undefined })
      return Some(gallery)
    }

    return None
  }

  public toJSON() {
    return {
      fieldId: this.fieldId?.value,
    }
  }
}
