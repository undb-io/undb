import { inject, singleton } from '@undb/di'
import type { Option } from '@undb/domain'
import type { IRecordQueryRepository, IRecordsDTO, Query, TableDo } from '@undb/table'
import type { IQueryBuilder } from '../qb'
import { injectQueryBuilder } from '../qb.provider'
import { UnderlyingTable } from '../underlying/underlying-table'
import { RecordFilterVisitor } from './record.filter-visitor'
import { RecordMapper } from './record.mapper'

@singleton()
export class RecordQueryRepository implements IRecordQueryRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @inject(RecordMapper)
    private readonly mapper: RecordMapper
  ) {}

  async find(table: TableDo, query: Option<Query>): Promise<IRecordsDTO> {
    const t = new UnderlyingTable(table)
    const result = await this.qb
      .selectFrom(t.name)
      // TODO: select spec
      .selectAll()
      .where((eb) => {
        const spec = query.into(null)?.filter
        const visitor = new RecordFilterVisitor(eb)
        if (spec?.isSome()) {
          spec.unwrap().accept(visitor)
        }
        return visitor.cond
      })
      .execute()

    return result.map((r) => this.mapper.toDTO(r))
  }
}
