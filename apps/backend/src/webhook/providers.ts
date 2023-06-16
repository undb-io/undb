import { Inject, Provider } from '@nestjs/common'
import { ExecuteWebhookWorkflow } from './temporal/workflows/execute-webhook.workflow.js'

const WEBHOOK_HTTP_SERVICE = Symbol('WEBHOOK_HTTP_SERVICE')

export const InjectWebhookHttpService = () => Inject(WEBHOOK_HTTP_SERVICE)

export const providers: Provider[] = [
  {
    provide: WEBHOOK_HTTP_SERVICE,
    useClass: ExecuteWebhookWorkflow,
  },
]
