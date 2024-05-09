import { trpc } from '$lib/trpc/client';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async () => {
	const tables = await trpc.table.list.query();

	return {
		tables
	};
};
