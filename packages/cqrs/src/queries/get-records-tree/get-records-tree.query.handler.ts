import {
  ClsStore,
  IClsService,
  TreeField,
  withTableViewRecordsSpec,
  type IRecordTreeQueryModel,
  type ITableRepository,
} from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IGetRecordsTreeOutput } from './get-records-tree.query.interface.js'
import type { GetRecordsTreeQuery } from './get-records-tree.query.js'

export class GetRecordsTreeQueryHandler implements IQueryHandler<GetRecordsTreeQuery, IGetRecordsTreeOutput> {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly rm: IRecordTreeQueryModel,
    protected readonly cls: IClsService<ClsStore>,
  ) {}

  async execute(query: GetRecordsTreeQuery): Promise<IGetRecordsTreeOutput> {
    const userId = this.cls.get('user.userId')
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const field = table.schema.getFieldByIdOfType(query.fieldId, TreeField).unwrap()

    const spec = withTableViewRecordsSpec(table, userId, query.viewId)
    const records = await this.rm.findTrees(table.id.value, field, spec)

    return { records }
  }
}
