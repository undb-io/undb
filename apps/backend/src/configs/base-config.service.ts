import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class BaseConfigService {
  constructor(private readonly config: ConfigService) {}

  public get isProd() {
    return this.config.get('NODE_ENV') === 'production'
  }

  public get host() {
    return this.config.get('UNDB_HOST')
  }
}
