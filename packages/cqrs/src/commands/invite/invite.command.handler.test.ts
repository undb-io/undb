import { ClsStore, IClsService, IUserRepository, User, UserId } from '@undb/core'
import { IInvitationRepository, Invitation, InvitationId, WithInvitationEmail } from '@undb/integrations'
import { MockProxy, mock } from 'vitest-mock-extended'
import { InviteCommand } from './invite.command'
import { InviteCommandHandler } from './invite.command.handler'
import { None, Some } from 'oxide.ts'
import { EmailVO } from '@undb/domain/dist'

describe('invite command handler test', () => {
  let repo: MockProxy<IInvitationRepository>
  let cls: MockProxy<IClsService<ClsStore>>
  let userRepo: MockProxy<IUserRepository>
  let command: InviteCommand
  let handler: InviteCommandHandler
  const user = new User()
  user.userId = new UserId('usr1')
  const invitation = new Invitation()
  invitation.id = new InvitationId('invitaion1')
  // invitation.email = WithInvitationEmail.fromString('user123@email.com')
  beforeEach(() => {
    repo = mock<IInvitationRepository>()
    cls = mock<IClsService<ClsStore>>()
    userRepo = mock<IUserRepository>()
    command = new InviteCommand({ email: 'user123@email.com', role: 'admin' })
    handler = new InviteCommandHandler(repo, userRepo, cls)
    cls.get.calledWith('user.userId').mockReturnValue('user123')
  })

  test('invite command handler test existing', async () => {
    userRepo.findOne.mockResolvedValue(None)
    userRepo.findOneById.mockResolvedValue(Some(user))
    repo.findOne.mockResolvedValue(Some(invitation))
    await handler.execute(command)
  })

  test('invite command handler test userAlreadyExists', async () => {
    userRepo.findOne.mockResolvedValue(Some(user))
    await expect(handler.execute(command)).rejects.toThrowErrorMatchingInlineSnapshot(
      '"user with email user123@email.com has already exists in system"',
    )
  })
})
