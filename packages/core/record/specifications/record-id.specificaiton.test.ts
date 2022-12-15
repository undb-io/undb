import { createTestRecord } from '../fixtures'
import { Record } from '../record'
import { WithRecordId } from './record-id.specifaction'

describe('WithRecordId', () => {
  test('#isSatisfiedBy', () => {
    const spec = WithRecordId.fromString('record')
    const is = spec.isSatisfiedBy(createTestRecord())
    expect(is).toBeTruthy()
  })

  test('#mutate', () => {
    const id = 'testint'
    const spec = WithRecordId.fromString(id)
    const record = Record.create()
    spec.mutate(record)

    expect(record.id.value).toBe(id)
  })
})
