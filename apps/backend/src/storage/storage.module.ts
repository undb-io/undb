import { S3Client } from '@aws-sdk/client-s3'
import { Module } from '@nestjs/common'
import { AwsSdkModule } from 'aws-sdk-v3-nest'
import { adapters, objectStorage } from './adapters/provider.js'
import { StorageHealthIndicator } from './storage.health.js'

@Module({
  imports: [
    AwsSdkModule.register({
      client: new S3Client({
        region: 'us-west-2',
        endpoint: process.env.UNDB_S3_ENDPOINT!,
        credentials: {
          accessKeyId: process.env.UNDB_S3_ACCESS_KEY!,
          secretAccessKey: process.env.UNDB_S3_SECRET_KEY!,
        },
      }),
    }),
  ],
  providers: [...adapters, StorageHealthIndicator],
  exports: [objectStorage, StorageHealthIndicator],
})
export class StorageModule {}
