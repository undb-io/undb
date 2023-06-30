import type { Provider } from '@nestjs/common'
import { Inject, Logger } from '@nestjs/common'
import type { Logger as TemporalLogger } from '@temporalio/worker'
import { Runtime, Worker } from '@temporalio/worker'
import path from 'node:path'
import { URL, fileURLToPath } from 'url'
import * as activities from './activities/index.js'

export const TEMPORAL_WORKER = Symbol('TEMPORAL_WORKER')

export const InjectTemporalWorker = () => Inject(TEMPORAL_WORKER)

const workflowsPathUrl = new URL(`./workflows/workflows${path.extname(import.meta.url)}`, import.meta.url)

export const temporalWorker: Provider = {
  provide: TEMPORAL_WORKER,
  useFactory: async () => {
    const logger = new Logger(TEMPORAL_WORKER.toString())

    const temporalLogger: TemporalLogger = {
      info: logger.log,
      log: logger.log,
      debug: logger.debug,
      error: logger.error,
      trace: logger.verbose,
      warn: logger.warn,
    }

    Runtime.install({
      logger: temporalLogger,
    })

    const worker = await Worker.create({
      workflowsPath: fileURLToPath(workflowsPathUrl),
      activities,
      taskQueue: 'undb_webhook',
    })

    return worker
  },
}
