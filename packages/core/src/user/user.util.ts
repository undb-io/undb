import { ANONYMOUS_USER_ID } from './user.constants.js'

export const isAnonymous = (userId: string) => userId === ANONYMOUS_USER_ID
