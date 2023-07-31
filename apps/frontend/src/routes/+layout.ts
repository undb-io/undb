import type { ICollaboratorProfile, IAppInfo } from '@undb/core'
import Cookies from 'js-cookie'
import type { LayoutLoad } from './$types'
import { env } from '$env/dynamic/public'

export const ssr = false

export const load: LayoutLoad = (event) => {
	const auth = Cookies.get('undb_auth')

	const appInfo =
		env.PUBLIC_UNDB_VERSION ??
		(event
			.fetch('/api/appInfo')
			.then((r) => r.json())
			.catch(() => ({
				appInfo: {
					version: null,
				},
			})) as Promise<{ appInfo: IAppInfo }>)

	if (!auth) {
		return { me: { me: null }, appInfo }
	}
	const me = event
		.fetch('/api/auth/me')
		.then((r) => r.json())
		.catch(() => ({ me: null })) as Promise<{ me: ICollaboratorProfile }>

	return { me, appInfo }
}
