import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { StorageHealthIndicator } from '../storage/storage.health.js'

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService, private readonly storageHealth: StorageHealthIndicator) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.storageHealth.isHealthy()])
  }
}
