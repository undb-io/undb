import { Injectable } from '@nestjs/common'
import { FLSAuthzService, type IFLSRepository } from '@undb/authz'
import type { ClsStore, IClsService } from '@undb/core'
import { ClsService } from 'nestjs-cls'
import { InjectFLSRepository } from './adapters/fls-sqlite.repository.js'

@Injectable()
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestFLSAuthzService extends FLSAuthzService {
  constructor(
    @InjectFLSRepository()
    protected readonly repo: IFLSRepository,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(repo, cls as IClsService<ClsStore>)
  }
}
