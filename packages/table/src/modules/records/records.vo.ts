import { ValueObject } from "@undb/domain"
import type { TableDo } from "../../table.do"
import type { IRecordsDTO } from "./dto"
import { RecordDO } from "./record/record.do"

export class Records extends ValueObject {
  constructor(public readonly records: RecordDO[]) {
    super(records)
  }

  static fromJSON(table: TableDo, records: IRecordsDTO): Records {
    return new Records(records.map((record) => RecordDO.fromJSON(table, record)))
  }

  get map() {
    return new Map(this.records.map((record) => [record.id.value, record]))
  }

  get isEmpty() {
    return this.records.length === 0
  }

  get count() {
    return this.records.length
  }

  *[Symbol.iterator]() {
    yield* this.records
  }
}
