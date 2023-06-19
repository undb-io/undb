import { Inject } from '@nestjs/common'
import { ConfigType, registerAs } from '@nestjs/config'

export const InjectOutboxConfig = () => Inject(outboxConfig.KEY)

export const outboxConfig = registerAs('outbox', () => {
  const seconds = process.env.UNDB_OUTBOX_POLLING_INTERVAL_SECONDS ?? '10'
  return {
    seconds: parseInt(seconds, 10),
  }
})

export type OutboxConfigType = ConfigType<typeof outboxConfig>
