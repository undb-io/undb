export function handleKeydown(e: KeyboardEvent) {
	const type = (e.target as any)?.type;
	const isInput = type === 'search' || type === 'input';

	if (e.key === 't' && !isInput) {
		// e.preventDefault();
		// createTableOpened.update((o) => !o);
	}
}
