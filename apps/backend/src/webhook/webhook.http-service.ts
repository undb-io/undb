import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import type { IWebhookHttpService } from '@undb/cqrs'
import type { IEvent } from '@undb/domain'
import type { Webhook } from '@undb/integrations'
import type { Observable } from 'rxjs'

@Injectable()
export class WebhookHttpService implements IWebhookHttpService {
  constructor(private readonly httpService: HttpService) {}

  handle(webhook: Webhook, event: IEvent<object>): Observable<any> {
    return this.httpService.post(webhook.url.unpack(), event.payload)
  }
}
