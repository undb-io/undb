import { WithRecordIdS } from '@egodb/core'
import { CompositeSpecification } from '@egodb/domain'
import { RecordInMemoryQueryVisitor } from './record-in-memory.query-visitor'

test.each<CompositeSpecification>([WithRecordIdS('test').not()])('test visitor not', (spec) => {
  const visitor = new RecordInMemoryQueryVisitor()

  spec.accept(visitor)

  const predicate = visitor.getPredicate()

  expect(predicate.isOk()).toBeTruthy()
  expect(predicate.unwrap()).toMatchInlineSnapshot('[Function]')
})
