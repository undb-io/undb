import { Injectable } from '@nestjs/common'
import { MemberService, type IMemberRepository } from '@undb/authz'
import type { IClsService } from '@undb/core'
import { type ClsStore } from '@undb/core'
import { ClsService } from 'nestjs-cls'
import { InjectMemberRespository } from './adapters/member-sqlite.respository.js'

@Injectable()
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class NestMemberService extends MemberService {
  constructor(
    protected readonly cls: ClsService<ClsStore>,
    @InjectMemberRespository()
    protected readonly repo: IMemberRepository,
  ) {
    super(cls as IClsService<ClsStore>, repo)
  }
}
