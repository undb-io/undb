import { Injectable } from '@nestjs/common'
import { RLSRecordSpecService, type IRLSRepository } from '@undb/authz'
import type { ClsStore, IClsService } from '@undb/core'
import { ClsService } from 'nestjs-cls'
import { InjectRLSRepository } from './adapters/rls-sqlite.repository.js'

@Injectable()
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestRLSRecordSpecService extends RLSRecordSpecService {
  constructor(
    @InjectRLSRepository()
    protected readonly repo: IRLSRepository,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(repo, cls as IClsService<ClsStore>)
  }
}
