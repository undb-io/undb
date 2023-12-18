import type { IAppInfo, ICollaboratorProfile } from '@undb/core'
import Cookies from 'js-cookie'
import type { LayoutLoad } from './$types'

export const ssr = false

export const load: LayoutLoad = async (event) => {
	const auth = Cookies.get('undb_auth')

	const appInfo = (await event
		.fetch('/api/appInfo')
		.then((r) => r.json())
		.catch(() => ({
			appInfo: {
				version: null,
			},
		}))) as { appInfo: IAppInfo }

	if (!auth) {
		return { me: { me: null }, appInfo }
	}
	const me = (await event
		.fetch('/api/auth/me')
		.then((r) => r.json())
		.catch(() => ({ me: null }))) as { me: ICollaboratorProfile }

	return { me, appInfo }
}
