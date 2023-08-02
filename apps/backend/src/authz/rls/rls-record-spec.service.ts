import { Injectable } from '@nestjs/common'
import { RLSRecordSpecService, type IRLSRepository } from '@undb/authz'
import { InjectRLSRepository } from './adapters/rls-sqlite.repository.js'

@Injectable()
export class NestRLSRecordSpecService extends RLSRecordSpecService {
  constructor(
    @InjectRLSRepository()
    protected readonly repo: IRLSRepository,
  ) {
    super(repo)
  }
}
