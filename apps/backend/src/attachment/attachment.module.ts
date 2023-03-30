import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { objectStorageConfig } from '../configs/object-storage.js'
import { objectStorage } from './adapters/provider.js'
import { AttachmentController } from './attachment.controller.js'
import { AttachmentService } from './attachment.service.js'

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      useFactory: (config: ConfigType<typeof objectStorageConfig>) => [{ rootPath: config.local.path }],
      inject: [objectStorageConfig.KEY],
    }),
  ],
  controllers: [AttachmentController],
  providers: [AttachmentService, objectStorage],
})
export class AttachmentModule {}
