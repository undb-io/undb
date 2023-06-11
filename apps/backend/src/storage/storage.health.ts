import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus'
import { InjectAws } from 'aws-sdk-v3-nest'
import { InjectObjectStorageConfig, objectStorageConfig } from '../configs/object-storage.config.js'

@Injectable()
export class StorageHealthIndicator extends HealthIndicator {
  constructor(
    // @ts-ignore
    @InjectAws(S3Client) private readonly s3: S3Client,
    @InjectObjectStorageConfig() private readonly config: ConfigType<typeof objectStorageConfig>,
  ) {
    super()
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    if (this.config.provider === 's3') {
      try {
        const bucket = this.config.s3.bucket
        await this.s3.send(new HeadBucketCommand({ Bucket: bucket }))
        return this.getStatus(this.config.provider, true)
      } catch (error) {
        throw new HealthCheckError('storgae health failed', (error as Error).message)
      }
    }

    return this.getStatus(this.config.provider, true)
  }
}
