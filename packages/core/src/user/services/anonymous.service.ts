import type { IClsService } from '../../cls/cls.js'
import { ANONYMOUS_USER_ID } from '../user.constants.js'

export class AnonymousService {
  static setCls(cls: IClsService) {
    cls.set('user.userId', ANONYMOUS_USER_ID)
    cls.set('user.isAnonymous', true)
  }
}
