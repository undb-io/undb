import { createTableOpened } from '$lib/components/blocks/create-table/create-table.store';

export function handleKeydown(e: KeyboardEvent) {
	if (e.key === 't') {
		e.preventDefault();
		createTableOpened.update((o) => !o);
	}
}
