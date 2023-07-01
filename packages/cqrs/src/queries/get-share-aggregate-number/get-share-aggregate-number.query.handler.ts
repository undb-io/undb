import { TableFactory, WithTableViewId, type IRecordAggregateRepository, type ITableQueryModel } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IShareGuardService } from '@undb/integrations'
import { WithShareView } from '@undb/integrations'
import type { IGetShareAggregateNumberOutput } from './get-share-aggregate-number.query.interface.js'
import type { GetShareAggregateNumberQuery } from './get-share-aggregate-number.query.js'

export class GetShareAggregateNumberQueryHandler
  implements IQueryHandler<GetShareAggregateNumberQuery, IGetShareAggregateNumberOutput>
{
  constructor(
    protected readonly guard: IShareGuardService,
    protected readonly tableQueryModel: ITableQueryModel,
    protected readonly repo: IRecordAggregateRepository,
  ) {}

  async execute(query: GetShareAggregateNumberQuery): Promise<IGetShareAggregateNumberOutput> {
    await this.guard.verify(new WithShareView(query.viewId))

    const table = (await this.tableQueryModel.findOne(WithTableViewId.fromString(query.viewId))).unwrap()
    const tb = TableFactory.fromQuery(table)
    const view = tb.mustGetView(query.viewId)
    const visualization = view.mustGetVisualization(query.visualizationId)

    const number = await this.repo.number(tb.id.value, visualization, null)

    return {
      number,
    }
  }
}
