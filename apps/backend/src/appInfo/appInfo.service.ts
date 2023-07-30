import { Injectable } from '@nestjs/common'

@Injectable()
export class AppInfoService {
  constructor() {}
  async getAppInfo() {
    return {
      version: 'TODO',
    }
  }
}
