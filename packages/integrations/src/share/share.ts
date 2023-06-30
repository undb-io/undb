import type { ShareId } from './share-id.vo.js'
import type { ShareTarget } from './share-target.vo.js'

export class Share {
  id!: ShareId
  target!: ShareTarget
  enabled!: boolean

  static empty() {
    return new Share()
  }
}
