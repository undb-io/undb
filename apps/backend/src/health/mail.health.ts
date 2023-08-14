import { Injectable } from '@nestjs/common'
import type { HealthIndicatorResult } from '@nestjs/terminus'
import { HealthCheckError, HealthIndicator, HttpHealthIndicator } from '@nestjs/terminus'
import { InjectMailConfig, type MailConfigType } from '../configs/mail.config.js'

@Injectable()
export class MailHealthIndicator extends HealthIndicator {
  constructor(
    @InjectMailConfig()
    private readonly config: MailConfigType,
    private http: HttpHealthIndicator,
  ) {
    super()
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    let isHealthy = true
    if (this.config.provider === 'basic') {
      try {
        await this.http.pingCheck('mail', this.config.health!)
      } catch (error) {
        isHealthy = false
      }
    }
    const result = this.getStatus('mail', isHealthy)

    if (isHealthy) {
      return result
    }
    throw new HealthCheckError('MailHealth failed', result)
  }
}
