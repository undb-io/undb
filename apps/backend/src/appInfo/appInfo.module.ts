import { Module } from '@nestjs/common'
import { AppInfoController } from './appInfo.controller.js'
import { AppInfoService } from './appInfo.service.js'

@Module({
  providers: [AppInfoService],
  controllers: [AppInfoController],
})
export class AppInfoModule {}
