import type { ICreateSelectFieldSchema, ICreateStringFieldInput } from '../field/index.js'
import { FieldFactory, SelectField, StringField } from '../field/index.js'
import { WithNewField, WithTableEmoji, WithTableId, WithTableName } from '../specifications/index.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import { TableFactory } from '../table.factory.js'
import type { ICreateViewInput_internal } from '../view/index.js'
import { ViewVO, Views } from '../view/index.js'
import { WithTableViews } from '../view/specifications/views.specification.js'

export const createTestTable = (...specs: TableCompositeSpecificaiton[]) => {
  let spec: TableCompositeSpecificaiton = WithTableId.fromExistingString('tableId')
    .unwrap()
    .and(WithTableName.fromString('name'))
    .and(new WithTableViews(new Views([])))
    .and(WithTableEmoji.fromString())
    .and(new WithNewField(FieldFactory.create({ type: 'string', name: 'field1' }) as StringField))

  for (const s of specs) {
    spec = spec.and(s)
  }

  return TableFactory.create(spec).unwrap()
}

export const createTestView = (input: Partial<ICreateViewInput_internal> = {}): ViewVO => {
  return ViewVO.create({
    id: 'viw1',
    name: 'view',
    ...input,
  })
}

export const createTestStringField = (input: Partial<Omit<ICreateStringFieldInput, 'type'>> = {}): StringField => {
  return StringField.create({
    id: 'fld1',
    name: 'select',
    ...input,
  })
}

export const createTestSelectField = (input: Partial<Omit<ICreateSelectFieldSchema, 'type'>> = {}): SelectField => {
  return SelectField.create({
    id: 'fld1',
    name: 'select',
    options: [
      { key: 'opt1', name: 'opt1', color: { name: 'blue', shade: 5 } },
      { key: 'opt2', name: 'opt2', color: { name: 'cyan', shade: 5 } },
    ],
    ...input,
  })
}
