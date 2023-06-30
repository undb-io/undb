import { proxyActivities } from '@temporalio/workflow'
import type { IWebhookMethod } from '@undb/integrations'
import type * as activities from '../activities/index.js'

const { executeWebhook } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
})

type ExecuteWebhookArgs = {
  headers: Record<string, string>
  method: IWebhookMethod
  url: string
  body: object
}

export async function executeWebhookWorkflow(args: ExecuteWebhookArgs) {
  return await executeWebhook(args)
}
