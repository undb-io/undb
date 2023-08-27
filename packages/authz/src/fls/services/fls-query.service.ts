import type { IFLSQueryModel } from '../fls.query-model'
import type { IQueryFLS } from '../fls.schema'
import { withTableFLS } from '../specifications'

export interface IFLSQueryService {
  findTableFLSS(tableId: string): Promise<IQueryFLS[]>
}

export class FLSQueryService implements IFLSQueryService {
  constructor(protected readonly rm: IFLSQueryModel) {}

  async findTableFLSS(tableId: string): Promise<IQueryFLS[]> {
    const spec = withTableFLS(tableId)
    return this.rm.find(spec)
  }
}
