import { Inject, Provider } from '@nestjs/common'
import { Client } from '@temporalio/client'

export const TEMPORAL_CLIENT = Symbol('TEMPORAL_CLIENT')

export const InjectTemporalClient = () => Inject(TEMPORAL_CLIENT)

export const temporalClient: Provider = {
  provide: TEMPORAL_CLIENT,
  useFactory: async () => {
    const client = new Client()

    return client
  },
}
