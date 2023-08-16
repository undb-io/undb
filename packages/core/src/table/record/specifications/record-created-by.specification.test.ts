import { createTestRecord } from '../fixtures'
import { CreatedByIn, WithRecordCreatedBy, WithRecordCreatedByProfile } from './record-created-by.specification'

const userId = 'usr1'
const anotherUserId = 'usr2'

test('WithRecordCreatedBy.mutate', () => {
  const spec = WithRecordCreatedBy.fromString(userId)
  const record = createTestRecord(spec)
  expect(record.createdBy).toMatchInlineSnapshot('"usr1"')
})

test.each<[WithRecordCreatedBy, WithRecordCreatedBy, boolean]>([
  [WithRecordCreatedBy.fromString(userId), WithRecordCreatedBy.fromString(userId), true],
  [WithRecordCreatedBy.fromString(anotherUserId), WithRecordCreatedBy.fromString(userId), false],
])('WithRecordCreatedBy.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[CreatedByIn, WithRecordCreatedBy, boolean]>([
  [new CreatedByIn([userId, anotherUserId]), WithRecordCreatedBy.fromString(userId), true],
  [new CreatedByIn([userId]), WithRecordCreatedBy.fromString(userId), true],
  [new CreatedByIn([anotherUserId]), WithRecordCreatedBy.fromString(userId), false],
  [new CreatedByIn([]), WithRecordCreatedBy.fromString(userId), false],
])('CreatedByIn.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test('WithRecordCreatedByProfile.mutate', () => {
  const spec = new WithRecordCreatedByProfile({ avatar: null, color: 'amber', username: 'user' })
  const record = createTestRecord(spec)
  expect(record.createdByProfile).toMatchInlineSnapshot(`
    {
      "avatar": null,
      "color": "amber",
      "username": "user",
    }
  `)
})
