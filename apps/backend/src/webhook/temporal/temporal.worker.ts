import { Inject, Provider } from '@nestjs/common'
import { Worker } from '@temporalio/worker'
import { createRequire } from 'node:module'
import * as activities from './activities/index.js'
const require = createRequire(import.meta.url)

export const TEMPORAL_WORKER = Symbol('TEMPORAL_WORKER')

export const InjectTemporalWorker = () => Inject(TEMPORAL_WORKER)

export const temporalWorker: Provider = {
  provide: TEMPORAL_WORKER,
  useFactory: async () => {
    const worker = await Worker.create({
      workflowsPath: require.resolve('./workflows/workflows'),
      activities,
      taskQueue: 'undb_webhook',
    })

    return worker
  },
}
