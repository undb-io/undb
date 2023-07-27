import type { IRecordTreeQueryModel, ITableQueryModel } from '@undb/core'
import { TableFactory, TreeField, WithTableViewId, withTableViewRecordsSpec } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IShareGuardService } from '@undb/integrations'
import { WithShareView } from '@undb/integrations'
import type { IGetShareViewTreeRecordsOutput } from './get-share-view-tree-records.query.interface.js'
import type { GetShareViewTreeRecordsQuery } from './get-share-view-tree-records.query.js'

export class GetShareViewTreeRecordsQueryHandler
  implements IQueryHandler<GetShareViewTreeRecordsQuery, IGetShareViewTreeRecordsOutput>
{
  constructor(
    protected readonly guard: IShareGuardService,
    protected readonly tableQueryModel: ITableQueryModel,
    protected readonly rm: IRecordTreeQueryModel,
  ) {}

  async execute(query: GetShareViewTreeRecordsQuery): Promise<IGetShareViewTreeRecordsOutput> {
    await this.guard.verify(new WithShareView(query.viewId))

    const table = (await this.tableQueryModel.findOne(WithTableViewId.fromString(query.viewId))).unwrap()
    const tb = TableFactory.fromQuery(table)
    const field = tb.schema.getFieldByIdOfType(query.fieldId, TreeField).unwrap()

    const spec = withTableViewRecordsSpec(tb, query.viewId)
    const records = await this.rm.findTrees(table.id, field, spec)

    return {
      records,
    }
  }
}
