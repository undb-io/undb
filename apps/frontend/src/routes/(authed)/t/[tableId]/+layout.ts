import { trpc } from '$lib/trpc/client';
import type { LayoutLoad } from './$types';

export const prerender = 'auto';

export const load: LayoutLoad = async (event) => {
	const { tableId } = event.params;

	event.depends(`table:${tableId}`);
	const table = await trpc.table.get.query({ tableId });

	return {
		table
	};
};
