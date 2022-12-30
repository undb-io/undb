import { FieldFactory } from '../field'
import { WithNewField, WithTableId, WithTableName, WithTableViews } from '../specifications'
import type { TableCompositeSpecificaiton } from '../specifications/interface'
import { TableFactory } from '../table.factory'
import { Views } from '../view'

export const createTestTable = (...specs: TableCompositeSpecificaiton[]) => {
  let spec: TableCompositeSpecificaiton = WithTableId.fromExistingString('tableId')
    .unwrap()
    .and(WithTableName.fromString('name'))
    .and(new WithTableViews(new Views([])))
    .and(new WithNewField(FieldFactory.create({ type: 'string', id: 'field1', name: 'field1' })))

  for (const s of specs) {
    spec = spec.and(s)
  }

  return TableFactory.create(spec).unwrap()
}
