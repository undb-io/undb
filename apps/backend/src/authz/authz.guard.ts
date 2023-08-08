import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { NestMemberService } from './member/member.service.js'

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(private readonly memberService: NestMemberService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await this.memberService.setCurrentMember()
    return this.memberService.verify()
  }
}
