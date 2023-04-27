import type { ICollaboratorProfile } from '@undb/core'
import type { LayoutLoad } from './$types'

export const ssr = false

export const load: LayoutLoad = (event) => {
	const me = event
		.fetch('/api/auth/me')
		.then((r) => r.json())
		.catch(() => ({ me: null })) as Promise<{ me: ICollaboratorProfile }>

	return { me }
}
