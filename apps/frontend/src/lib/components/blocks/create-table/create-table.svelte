<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { trpc } from '$lib/trpc/client.js';
	import { createMutation } from '@tanstack/svelte-query';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { createTableCommand } from '@undb/commands';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { createTableOpened } from './create-table.store';
	import CreateSchema from './create-schema.svelte';
	import { toast } from 'svelte-sonner';
	import { invalidate } from '$app/navigation';
	import { goto } from '$app/navigation';

	export let data: SuperValidated<any>;

	const mutation = createMutation({
		mutationFn: trpc.table.create.mutate,
		async onSuccess(data) {
			await invalidate('undb:tables');
			await goto(`/t/${data}`);
			createTableOpened.set(false);
			form.reset();
		},
		onError(error) {
			toast.error(error.message);
		}
	});

	const form = superForm(data, {
		SPA: true,
		dataType: 'json',
		// @ts-ignore
		validators: zodClient(createTableCommand),
		resetForm: false,
		invalidateAll: false,
		onSubmit() {
			$mutation.mutate($formData);
		}
	});

	const { form: formData, enhance } = form;
</script>

<form id="createTable" method="POST" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Fieldset {form} name="schema">
		<CreateSchema />
	</Form.Fieldset>
</form>

<!-- <SuperDebug data={$formData} /> -->
