import { createTableCommand } from '@undb/commands';
import { createSchemaDTO } from '@undb/table';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
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
		createTableForm
	};
};
