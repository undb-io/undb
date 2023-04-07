import { ValueObject } from '@egodb/domain'

export class FieldIssue<Reason extends string> extends ValueObject<Reason> {}
