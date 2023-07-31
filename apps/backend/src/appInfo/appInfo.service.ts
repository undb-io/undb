import { Injectable } from '@nestjs/common'
import packageFile from '../../../../package.json' assert { type: 'json' }

@Injectable()
export class AppInfoService {
  constructor() {}
  getAppInfo() {
    if (process.env.UNDB_VERSION) {
      return {
        version: `v${process.env.UNDB_VERSION}`,
      }
    }
    const { version } = packageFile
    return {
      version: `v${version}`,
    }
  }
}
