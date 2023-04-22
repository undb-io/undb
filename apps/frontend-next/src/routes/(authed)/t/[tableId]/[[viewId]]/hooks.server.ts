import { redirect, type HandleServerError } from '@sveltejs/kit'

export const handleError: HandleServerError = ({ error, event }) => {
	throw redirect(303, '/')
}
