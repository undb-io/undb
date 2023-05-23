import { S3Client } from '@aws-sdk/client-s3'
import { DynamicModule, Module } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { AwsSdkModule } from 'aws-sdk-v3-nest'
import { InjectObjectStorageConfig, objectStorageConfig } from '../configs/object-storage.config.js'
import { objectStorage, providers } from './adapters/provider.js'

@Module({})
export class StorageModule {
  constructor(@InjectObjectStorageConfig() private readonly config: ConfigType<typeof objectStorageConfig>) {}

  static register(): DynamicModule {
    return {
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
      module: StorageModule,
      providers,
      exports: [objectStorage],
    }
  }
}
