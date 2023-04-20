import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	return {
		members: event.fetch('/members').then((r) => r.json()),
	}
}
