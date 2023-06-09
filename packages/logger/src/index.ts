import type { Logger } from 'pino'
import pino from 'pino'
import pretty from 'pino-pretty'

const stream = process.env.NODE_ENV === 'production' ? undefined : pretty()

export const createLogger = () => pino(stream)

export const logger = createLogger()

export type ILogger = Pick<Logger, 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'>
