import type { IRLSRecordSpecService } from '@undb/authz'
import type { ClsStore, IClsService, IRecordQueryModel, ITableRepository } from '@undb/core'
import { ViewId, withTableViewRecordsSpec } from '@undb/core'
import { andOptions, type IQueryHandler } from '@undb/domain'
import { Option } from 'oxide.ts'
import type { IGetRecordsOutput } from './get-records.query.interface.js'
import type { GetRecordsQuery } from './get-records.query.js'

export class GetRecordsQueryHandler implements IQueryHandler<GetRecordsQuery, IGetRecordsOutput> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly rm: IRecordQueryModel,
    protected readonly cls: IClsService<ClsStore>,
    protected readonly rls: IRLSRecordSpecService,
  ) {}

  async execute(query: GetRecordsQuery) {
    const userId = this.cls.get('user.userId')
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const spec = withTableViewRecordsSpec(table, userId, query.viewId, query.filter, query.q)
    const rlsSpec = await this.rls.list(table.id.value)

    const viewId = query.viewId ? ViewId.fromString(query.viewId) : undefined
    const { records, total } = await this.rm.findAndCount(
      table.id.value,
      viewId,
      andOptions(rlsSpec, Option(spec)).into(null),
    )

    return { records, total }
  }
}
