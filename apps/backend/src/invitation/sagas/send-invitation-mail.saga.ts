import { Injectable } from '@nestjs/common'
import type { ICommand, IEvent } from '@nestjs/cqrs'
import { Saga, ofType } from '@nestjs/cqrs'
import { SendInvitationMailCommand } from '@undb/cqrs'
import { InvitedEvent } from '@undb/integrations'
import type { Observable } from 'rxjs'
import { map } from 'rxjs'

@Injectable()
export class SendInvitationMailSaga {
  @Saga()
  invited = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(InvitedEvent),
      map((event) => new SendInvitationMailCommand({ id: event.payload.id })),
    )
  }
}
