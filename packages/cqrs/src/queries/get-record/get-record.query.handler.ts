import type { IRLSAuthzService } from '@undb/authz'
import { RecordFactory, type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IGetRecordOutput } from './get-record.query.interface.js'
import type { GetRecordQuery } from './get-record.query.js'

export class GetRecordQueryHandler implements IQueryHandler<GetRecordQuery, IGetRecordOutput> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly rm: IRecordQueryModel,
    protected readonly rls: IRLSAuthzService,
  ) {}

  async execute(query: GetRecordQuery): Promise<IGetRecordOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const record = (await this.rm.findOneById(query.tableId, query.id)).into()

    if (record) {
      await this.rls.check('view', table, RecordFactory.fromQuery(record, table.schema.toIdMap()).unwrap())
    }

    return record
  }
}
