import { Injectable } from '@nestjs/common'
import packageFile from '../../../../package.json' assert { type: 'json' }

@Injectable()
export class AppInfoService {
  constructor() {}
  getAppInfo() {
    const { version } = packageFile
    return {
      version: `v${version}`,
    }
  }
}
