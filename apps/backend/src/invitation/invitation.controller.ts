import { Controller, Get, Param, Res } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { AcceptInvitationCommand } from '@undb/cqrs'
import { type IInvitationRepository } from '@undb/integrations'
import { type Response } from 'express'
import { InjectInvitationRepository } from './adapters/invitation-sqlite.repository.js'

@Controller('invitations')
export class InvitationController {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectInvitationRepository()
    private readonly repo: IInvitationRepository,
  ) {}

  @Get('/:id/accept')
  public async accept(@Res() res: Response, @Param('id') id: string) {
    const cmd = new AcceptInvitationCommand({ id })
    await this.commandBus.execute(cmd)

    const invitation = (await this.repo.findOneById(id)).unwrap()

    res.redirect('/register?email=' + invitation.email.unpack())
  }
}
