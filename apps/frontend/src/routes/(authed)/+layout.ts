import { trpc } from '$lib/trpc/client';
import { createTableCommand } from '@undb/commands';
import { createSchemaDTO } from '@undb/table';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async () => {
	const tables = await trpc.table.list.query();

	const createTableForm = await superValidate(
		zod(
			createTableCommand.merge(
				z.object({
					schema: createSchemaDTO.default([{ type: 'string', name: 'field1' }])
				})
			)
		)
	);

	return {
		tables,
		createTableForm
	};
};
