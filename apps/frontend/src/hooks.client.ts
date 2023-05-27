import type { HandleClientError } from '@sveltejs/kit'

export const handleError: HandleClientError = ({ error }) => {
	const err = error as any
	return {
		message: err.message,
		code: err?.code ?? 'UNKNOWN',
	}
}
