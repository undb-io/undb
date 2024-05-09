import { singleton } from '@undb/di'
import type { Option } from '@undb/domain'
import type { IRecordRepository } from '@undb/table'
import type { RecordComositeSpecification } from '@undb/table/src/modules/records/record/record.composite-specification'
import type { IQueryBuilder } from '../qb'
import { injectQueryBuilder } from '../qb.provider'
import { RecordFilterVisitor } from './record.filter-visitor'

@singleton()
export class RecordRepository implements IRecordRepository {
  constructor(@injectQueryBuilder() private readonly qb: IQueryBuilder) {}

  async find(spec: Option<RecordComositeSpecification>) {
    const qb = await this.qb
      .selectFrom('tbl_28phug5p08')
      .selectAll()
      .where((eb) => {
        const visitor = new RecordFilterVisitor(eb)
        if (spec.isSome()) {
          spec.unwrap().accept(visitor)
        }
        return visitor.cond
      })
      .execute()
  }
}
