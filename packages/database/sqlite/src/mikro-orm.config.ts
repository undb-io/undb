import path from 'path'
import { createConfig } from './create-mikro-orm-config.js'

export default createConfig(path.resolve('../../../.ego/data'))
