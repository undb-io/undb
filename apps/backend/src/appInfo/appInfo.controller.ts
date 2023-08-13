import type { OnModuleInit } from '@nestjs/common'
import { Controller, Get } from '@nestjs/common'
import { AppInfoService } from './appInfo.service.js'

@Controller('appInfo')
export class AppInfoController implements OnModuleInit {
  constructor(private readonly appInfo: AppInfoService) {}

  async onModuleInit() {}

  @Get()
  getAppInfo() {
    return this.appInfo.getAppInfo()
  }
}
