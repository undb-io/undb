import { createTestRecord } from '../fixtures'
import { UdpatedByIn, WithRecordUpdatedBy, WithRecordUpdatedByProfile } from './record-updated-by.specification.js'

const userId = 'usr1'
const anotherUserId = 'usr2'

test('WithRecordUpdatedBy.mutate', () => {
  const spec = WithRecordUpdatedBy.fromString(userId)
  const record = createTestRecord(spec)
  expect(record.updatedBy).toMatchInlineSnapshot('"usr1"')
})

test.each<[WithRecordUpdatedBy, WithRecordUpdatedBy, boolean]>([
  [WithRecordUpdatedBy.fromString(userId), WithRecordUpdatedBy.fromString(userId), true],
  [WithRecordUpdatedBy.fromString(anotherUserId), WithRecordUpdatedBy.fromString(userId), false],
])('WithRecordUpdatedBy.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test.each<[UdpatedByIn, WithRecordUpdatedBy, boolean]>([
  [new UdpatedByIn([userId, anotherUserId]), WithRecordUpdatedBy.fromString(userId), true],
  [new UdpatedByIn([userId]), WithRecordUpdatedBy.fromString(userId), true],
  [new UdpatedByIn([anotherUserId]), WithRecordUpdatedBy.fromString(userId), false],
  [new UdpatedByIn([]), WithRecordUpdatedBy.fromString(userId), false],
])('UdpatedByIn.isSatisfiedBy', (spec, value, result) => {
  const record = createTestRecord(value)
  expect(spec.isSatisfiedBy(record)).toBe(result)
})

test('WithRecordUpdatedByProfile.mutate', () => {
  const spec = new WithRecordUpdatedByProfile({ avatar: null, color: 'amber', username: 'user' })
  const record = createTestRecord(spec)
  expect(record.updatedByProfile).toMatchInlineSnapshot(`
    {
      "avatar": null,
      "color": "amber",
      "username": "user",
    }
  `)
})
