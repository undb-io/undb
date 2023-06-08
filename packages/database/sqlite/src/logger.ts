import type { LogContext, Logger, LoggerNamespace, LoggerOptions } from '@mikro-orm/core'
import { createLogger } from '@undb/logger'

export class SqliteLogger implements Logger {
  private logger = createLogger()
  constructor(private readonly options: LoggerOptions) {}
  log(namespace: LoggerNamespace, message: string, context?: LogContext | undefined): void {
    this.logger.info({ namespace, context }, message)
  }
  error(namespace: LoggerNamespace, message: string, context?: LogContext | undefined): void {
    this.logger.error({ namespace, context }, message)
  }
  warn(namespace: LoggerNamespace, message: string, context?: LogContext | undefined): void {
    this.logger.warn({ namespace, context }, message)
  }
  logQuery(context: LogContext): void {
    const { query, ...rest } = context
    const sql =
      this.options.highlighter && query && process.env.NODE_ENV !== 'production'
        ? this.options.highlighter.highlight(query.replace(/(\r\n|\n|\r)/gm, ''))
        : query?.replace(/(\r\n|\n|\r)/gm, '')
    this.logger.info(rest, sql)
  }
  setDebugMode(debugMode: boolean | LoggerNamespace[]): void {
    this.logger.level = debugMode ? 'info' : 'silent'
  }
  isEnabled(namespace: LoggerNamespace): boolean {
    return true
  }
}
