<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { createSchemaDTO } from '@undb/table';
	import { getFormField } from 'formsnap';
	import type { Infer } from 'sveltekit-superforms';
	import { z } from 'zod';

	const schema = z.object({ schema: createSchemaDTO });
	const { form } = getFormField<Infer<typeof schema>, 'schema'>();

	const { form: formData } = form;
</script>

<Form.Legend>Schema</Form.Legend>
{#each $formData.schema as _, i}
	<Form.ElementField {form} name="">
		<Form.Control let:attrs>
			<Input {...attrs} bind:value={$formData.schema[i].name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.ElementField>
{/each}
<Form.FieldErrors />
