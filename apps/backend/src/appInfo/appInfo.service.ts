import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class AppInfoService {
  constructor(private readonly httpService: HttpService) {}
  async getAppInfo() {
    try {
      const appVersion = await this.httpService.axiosRef.get('https://api.github.com/repos/undb-xyz/undb/tags')
      return {
        version: appVersion.data?.[0]?.name,
      }
    } catch {
      return {
        version: null,
      }
    }
  }
}
