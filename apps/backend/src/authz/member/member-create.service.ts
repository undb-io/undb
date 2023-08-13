import { Injectable } from '@nestjs/common'
import { MemberCreateService, type IMemberRepository } from '@undb/authz'
import { InjectMemberRespository } from './adapters/member-sqlite.respository.js'

@Injectable()
export class NestMemberCreateService extends MemberCreateService {
  constructor(
    @InjectMemberRespository()
    protected readonly repo: IMemberRepository,
  ) {
    super(repo)
  }
}
