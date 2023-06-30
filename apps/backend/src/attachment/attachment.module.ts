import { Module } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { objectStorageConfig } from '../configs/object-storage.config.js'
import { StorageModule } from '../storage/storage.module.js'
import { AttachmentController } from './attachment.controller.js'
import { AttachmentService } from './attachment.service.js'

@Module({
  imports: [
    StorageModule,
    ServeStaticModule.forRootAsync({
      useFactory: (config: ConfigType<typeof objectStorageConfig>) => [
        {
          rootPath: config.local.path,
          serveRoot: '/public',
        },
      ],
      inject: [objectStorageConfig.KEY],
    }),
  ],
  controllers: [AttachmentController],
  providers: [AttachmentService],
})
export class AttachmentModule {}
