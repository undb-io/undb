import { Injectable } from '@nestjs/common'
import { Saga, ofType } from '@nestjs/cqrs'
import { TableCreatedEvent } from '@undb/core'
import { InitTableSearchCommand } from '@undb/cqrs'
import { Observable, map } from 'rxjs'

@Injectable()
export class InitSearchTableSaga {
  @Saga()
  initTable = (events$: Observable<any>) => {
    return events$.pipe(
      ofType(TableCreatedEvent),
      map((event) => new InitTableSearchCommand({ tableId: event.id })),
    )
  }
}
