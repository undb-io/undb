import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'
import { RecordValueSpecifcationBase } from './record-value-specification.base'

export class DateEqual extends RecordValueSpecifcationBase<Date> {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getDateValue(this.name).mapOr(false, (value) => value === this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateEqual(this)
    return Ok(undefined)
  }
}

export class DateGreaterThan extends RecordValueSpecifcationBase<Date> {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getDateValue(this.name).mapOr(false, (value) => value > this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateGreaterThan(this)
    return Ok(undefined)
  }
}

export class DateLessThan extends RecordValueSpecifcationBase<Date> {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getDateValue(this.name).mapOr(false, (value) => value < this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateLessThan(this)
    return Ok(undefined)
  }
}

export class DateGreaterThanOrEqual extends RecordValueSpecifcationBase<Date> {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getDateValue(this.name).mapOr(false, (value) => value >= this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateGreaterThanOrEqual(this)
    return Ok(undefined)
  }
}

export class DateLessThanOrEqual extends RecordValueSpecifcationBase<Date> {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getDateValue(this.name).mapOr(false, (value) => value <= this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.dateLessThanOrEqual(this)
    return Ok(undefined)
  }
}
