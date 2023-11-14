import { MEMORY_DATABASE } from './constants.js'

export const isMemoryDatabase = (data?: string): data is typeof MEMORY_DATABASE => data === MEMORY_DATABASE
