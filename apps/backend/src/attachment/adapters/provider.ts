import { Inject, Provider } from '@nestjs/common'
import { LocalObjectStorage } from './local-object-storage.js'

const ObjectStorage = Symbol.for('ObjectStorage')

export const InjectObjectStorage = () => Inject(ObjectStorage)

export const objectStorage: Provider = {
  provide: ObjectStorage,
  useClass: LocalObjectStorage,
}
