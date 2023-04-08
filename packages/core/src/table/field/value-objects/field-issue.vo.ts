import { ValueObject } from '@undb/domain'

export class FieldIssue<Reason extends string> extends ValueObject<Reason> {}
