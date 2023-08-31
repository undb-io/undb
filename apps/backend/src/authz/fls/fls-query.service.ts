import { Injectable } from '@nestjs/common'
import { FLSQueryService, type IFLSQueryModel } from '@undb/authz'
import { InjectFLSQueryModel } from './adapters/fls-sqlite.query-model.js'

@Injectable()
export class NestFLSQueryService extends FLSQueryService {
  constructor(
    @InjectFLSQueryModel()
    protected readonly rm: IFLSQueryModel,
  ) {
    super(rm)
  }
}
