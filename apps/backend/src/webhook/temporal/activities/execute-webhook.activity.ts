import type { IWebhookMethod } from '@undb/integrations'
import got from 'got'

type ExecuteWebhookArgs = {
  headers: Record<string, string>
  method: IWebhookMethod
  url: string
  body: object
}

export async function executeWebhook({ headers, url, method, body }: ExecuteWebhookArgs) {
  const response = await got(url, {
    method: method,
    json: body,
    headers,
  })

  return {
    statusCode: response.statusCode,
    statusMessage: response.statusMessage,
    body: response.body,
  }
}
