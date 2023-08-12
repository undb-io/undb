import { DateVO } from '@undb/domain'
import { addMonths } from 'date-fns'

export class InvitationExpiredAt extends DateVO {
  static default(): InvitationExpiredAt {
    const defaultExpired = addMonths(new Date(), 1)
    return new this(defaultExpired)
  }
}
