import type { ICollaboratorProfile } from '@undb/core'
import Cookies from 'js-cookie'
import type { LayoutLoad } from './$types'

export const ssr = false

export const load: LayoutLoad = (event) => {
	const auth = Cookies.get('undb_auth')
	if (!auth) {
		return { me: { me: null } }
	}
	const me = event
		.fetch('/api/auth/me')
		.then((r) => r.json())
		.catch(() => ({ me: null })) as Promise<{ me: ICollaboratorProfile }>

	return { me }
}
