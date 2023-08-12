import type { IRLSRecordSpecService } from '@undb/authz'
import type { ClsStore, IClsService, IRecordQueryModel, ITableRepository } from '@undb/core'
import { withTableRecordsSpec } from '@undb/core'
import { andOptions, type IQueryHandler } from '@undb/domain'
import { Some } from 'oxide.ts'
import type { IGetTrashRecordsOutput } from './get-trash-records.query.interface.js'
import type { GetTrashRecordsQuery } from './get-trash-records.query.js'

export class GetTrashRecordsQueryHandler implements IQueryHandler<GetTrashRecordsQuery, IGetTrashRecordsOutput> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly rm: IRecordQueryModel,
    protected readonly cls: IClsService<ClsStore>,
    protected readonly rls: IRLSRecordSpecService,
  ) {}

  async execute(query: GetTrashRecordsQuery) {
    const userId = this.cls.get('user.userId')
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const spec = withTableRecordsSpec(table, userId, query.filter, query.q)

    const rlsSpec = await this.rls.list(table.id.value)

    const { records, total } = await this.rm.findDeletedAndCount(
      table.id.value,
      andOptions(rlsSpec, Some(spec)).into(null),
      { pagination: query.pagination },
    )

    return { records, total }
  }
}
