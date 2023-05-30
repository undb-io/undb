import { ValueObject } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { FieldId } from '../../field/index.js'
import type { ITreeViewSchema } from './tree-view.schema.js'
import type { ITreeView } from './tree-view.type.js'

export class TreeView extends ValueObject<ITreeView> {
  static from(input: ITreeViewSchema) {
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

  public removeField(fieldId: FieldId): Option<TreeView> {
    if (this.fieldId?.equals(fieldId)) {
      const treeView = new TreeView({ ...this, fieldId: undefined })
      return Some(treeView)
    }

    return None
  }

  public toJSON() {
    return {
      fieldId: this.fieldId?.value,
    }
  }
}
