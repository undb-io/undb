import { redirect, type HandleClientError } from '@sveltejs/kit'

export const handleError: HandleClientError = () => {
	redirect(303, '/')
}
