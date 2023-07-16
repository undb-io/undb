<script lang="ts">
	import { page } from '$app/stores'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { getTable } from '$lib/store/table'
	import { Button, Label, Spinner } from 'flowbite-svelte'
	import { keys, pick } from 'lodash-es'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'

	export let data: Validation<any>

	const table = getTable()

	const { form, enhance, constraints, delayed, submitting, tainted } = superForm(data, {
		id: 'createRecord',
		SPA: true,
		dataType: 'json',
		invalidateAll: false,
		resetForm: false,
		delayMs: 100,
		clearOnSubmit: 'errors-and-message',
		taintedMessage: null,
		async onUpdate(event) {
			const taintedKeys = keys($tainted)
			const values = pick(event.form.data, taintedKeys)
			// $createRecord.mutate({ tableId: $table.id.value, values })
		},
	})

	$: f = $table.forms.getById($page.params.formId).unwrap()

	$: fields = f.getNotHiddenFields($table.schema.toIdMap())
</script>

<main>
	<div class="container mx-auto">
		<form id="createShareRecord" class="space-y-5" method="POST" use:enhance>
			<div class="grid grid-cols-5 gap-x-3 gap-y-4 items-center">
				{#each fields as field}
					<div class="h-full items-start gap-1 pt-2">
						<Label class="leading-5" for={field.id.value} data-field-id={field.id.value}>
							<div class="inline-flex items-center gap-2">
								<FieldIcon type={field.type} size={16} />
								<span>
									{field.name.value}
								</span>
							</div>
							{#if field.required}
								<span class="text-red-500">*</span>
							{/if}
						</Label>
					</div>
					<div class="col-span-4">
						<CellInput class="w-full" {field} bind:value={$form[field.id.value]} {...$constraints[field.id.value]} />
					</div>
				{/each}
			</div>

			<div class="w-full flex justify-end gap-2">
				<Button class="gap-2" type="submit" form="createShareRecord" disabled={$submitting}>
					{#if $delayed}
						<Spinner size="5" />
					{:else}
						<i class="ti ti-row-insert-bottom" />
					{/if}
					{$t('Create New Record')}
				</Button>
			</div>
		</form>
	</div>
</main>
