import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { PermissionAction } from '@undb/authz'
import { NestMemberService } from './member/member.service.js'

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(
    private readonly memberService: NestMemberService,
    private readonly reflect: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await this.memberService.setCurrentMember()

    const permissions = this.reflect.get<PermissionAction[]>('permissions', context.getHandler())
    if (!permissions?.length) return true

    return this.memberService.verify(permissions)
  }
}
