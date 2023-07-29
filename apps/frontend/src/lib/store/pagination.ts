import type { IPagination } from '@undb/domain'
import { writable } from 'svelte/store'

export const createPagination = (limit: number = 10) => {
	const pagination = writable<Required<IPagination>>({ limit, page: 1 })
	const { set, update, subscribe } = pagination

	const goto = (page: number) => {
		return update(($page) => {
			$page.page = page

			return $page
		})
	}

	const next = () => {
		return update(($page) => {
			const nextPage = $page.page + 1
			$page.page = nextPage

			return $page
		})
	}

	const prev = () => {
		return update(($page) => {
			const prevPage = $page.page - 1
			$page.page = prevPage

			return $page
		})
	}

	const reset = () => {
		return set({ limit, page: 1 })
	}

	return {
		set,
		update,
		subscribe,

		goto,
		next,
		prev,
		reset,
	}
}
