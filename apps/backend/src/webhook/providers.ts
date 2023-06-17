import { Inject } from '@nestjs/common'

export const WEBHOOK_HTTP_SERVICE = Symbol('WEBHOOK_HTTP_SERVICE')

export const InjectWebhookHttpService = () => Inject(WEBHOOK_HTTP_SERVICE)
