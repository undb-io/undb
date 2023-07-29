import { Inject } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { registerAs } from '@nestjs/config'

export const InjectOutboxConfig = () => Inject(outboxConfig.KEY)

export const outboxConfig = registerAs('outbox', () => {
  const seconds = process.env.UNDB_OUTBOX_POLLING_INTERVAL_SECONDS ?? '10'
  const count = process.env.UNDB_OUTBOX_POLLING_COUNT ?? '10'
  return {
    seconds: parseInt(seconds, 10),
    count: parseInt(count, 10),
  }
})

export type OutboxConfigType = ConfigType<typeof outboxConfig>
