import { type ISpecification } from '@egodb/domain'
import { type Record } from '../record'
import type { WithRecordId } from './record-id.specifaction'

export interface IRecordSpecVisitor {
  idEqual(s: WithRecordId): void
}

export type IRecordSpec = ISpecification<Record, IRecordSpecVisitor>
