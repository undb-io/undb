import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { type ConfigType } from '@nestjs/config'
import type { HealthIndicatorResult } from '@nestjs/terminus'
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus'
import { InjectAws } from 'aws-sdk-v3-nest'
import type { objectStorageConfig } from '../configs/object-storage.config.js'
import { InjectObjectStorageConfig } from '../configs/object-storage.config.js'

@Injectable()
export class StorageHealthIndicator extends HealthIndicator {
  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
        await this.s3.send(new HeadBucketCommand({ Bucket: bucket }) as any)
        return this.getStatus(this.config.provider, true)
      } catch (error) {
        throw new HealthCheckError('storgae health failed', (error as Error).message)
      }
    }

    return this.getStatus(this.config.provider, true)
  }
}
