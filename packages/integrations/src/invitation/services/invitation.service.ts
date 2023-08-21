import type { IInvitationRepository } from '../invitation.repository.js'
import type { IInvitationMailService } from './mail.service.js'

export interface IInvitationService {
  sendInvitationMail(id: string): Promise<void>
}

export class InvitationService implements IInvitationService {
  constructor(
    protected readonly repo: IInvitationRepository,
    protected readonly mailService: IInvitationMailService,
  ) {}

  async sendInvitationMail(id: string): Promise<void> {
    try {
      const invitation = (await this.repo.findOneById(id)).unwrap()

      await this.mailService.send(invitation)
    } catch (error) {
      throw error
    }
  }
}
