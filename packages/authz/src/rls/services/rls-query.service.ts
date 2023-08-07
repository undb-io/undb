import type { IRLSQueryModel } from '../rls.query-model.js'
import type { IQueryRLS } from '../rls.schema.js'
import { withTableRLS } from '../specifications/index.js'

export interface IRLSQueryService {
  findTableRLSS(tableId: string): Promise<IQueryRLS[]>
}

export class RLSQueryService implements IRLSQueryService {
  constructor(protected readonly rm: IRLSQueryModel) {}
  async findTableRLSS(tableId: string): Promise<IQueryRLS[]> {
    const spec = withTableRLS(tableId)
    return this.rm.find(spec)
  }
}
