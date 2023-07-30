import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { AppInfoController } from './appInfo.controller.js'
import { AppInfoService } from './appInfo.service.js'

@Module({
  imports: [HttpModule],
  providers: [AppInfoService],
  controllers: [AppInfoController],
})
export class AppInfoModule {}
