import type { StringField } from '../field/index.js'
import { FieldFactory } from '../field/index.js'
import { WithNewField, WithTableId, WithTableName } from '../specifications/index.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import { TableFactory } from '../table.factory.js'
import { Views } from '../view/index.js'
import { WithTableViews } from '../view/specifications/views.specification.js'

export const createTestTable = (...specs: TableCompositeSpecificaiton[]) => {
  let spec: TableCompositeSpecificaiton = WithTableId.fromExistingString('tableId')
    .unwrap()
    .and(WithTableName.fromString('name'))
    .and(new WithTableViews(new Views([])))
    .and(new WithNewField(FieldFactory.create({ type: 'string', name: 'field1' }) as StringField))

  for (const s of specs) {
    spec = spec.and(s)
  }

  return TableFactory.create(spec).unwrap()
}
