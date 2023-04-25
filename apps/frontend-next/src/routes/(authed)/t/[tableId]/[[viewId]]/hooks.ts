import { redirect, type HandleClientError } from '@sveltejs/kit'

export const handleError: HandleClientError = ({ error, event }) => {
	throw redirect(303, '/')
}
