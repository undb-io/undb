import { trpc } from '$lib/trpc/client';
import { createTableCommand } from '@undb/commands';
import { createSchemaDTO } from '@undb/table';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async (event) => {
	const tables = await trpc.table.list.query();
	event.depends('undb:tables');

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
