import type { PageLoad } from './$types'

export const ssr = false
export const prerender = true
export const load: PageLoad = async (event) => {
	return {
		members: event.fetch('/members').then((r) => r.json()),
	}
}
