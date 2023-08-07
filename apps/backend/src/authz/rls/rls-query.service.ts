import { Injectable } from '@nestjs/common'
import { RLSQueryService, type IRLSQueryModel } from '@undb/authz'
import { InjectRLSQueryModel } from './adapters/rls-sqlite.query-model.js'

@Injectable()
export class NestRLSQueryService extends RLSQueryService {
  constructor(
    @InjectRLSQueryModel()
    protected readonly rm: IRLSQueryModel,
  ) {
    super(rm)
  }
}
