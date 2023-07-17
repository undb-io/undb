<script lang="ts">
	import { page } from '$app/stores'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { getTable, shareTarget } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { Alert, Button, Heading, Label, P, Spinner } from 'flowbite-svelte'
	import { keys, pick } from 'lodash-es'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'
	import logo from '$lib/assets/logo.svg'

	export let data: Validation<any>

	const table = getTable()
	let submitted = false

	const createShareRecord = trpc().share.createRecord.mutation({
		onSuccess(data, variables, context) {
			submitted = true
		},
	})

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
			if (!$shareTarget) return

			const taintedKeys = keys($tainted)
			const values = pick(event.form.data, taintedKeys)
			$createShareRecord.mutate({
				tableId: $table.id.value,
				target: $shareTarget,
				values,
			})
		},
	})

	$: f = $table.forms.getById($page.params.formId).unwrap()

	$: fields = f.getNotHiddenFields($table.schema)
</script>

<main class="bg-blue-50 h-screen w-screen flex flex-col dark:bg-gray-500">
	<div class="container mx-auto w-full flex items-center justify-center flex-1">
		<section
			class="border dark:border-gray-700 rounded-md bg-white py-8 px-6 shadow-lg w-full max-w-5xl dark:bg-gray-600 dark:text-gray-200"
		>
			<Heading tag="h3" class="text-center mb-5">{f.name.value}</Heading>
			{#if !submitted}
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
									{#if f.fields.isRequired(field.id.value)}
										<span class="text-red-500">*</span>
									{/if}
								</Label>
							</div>
							<div class="col-span-4">
								<CellInput
									class="w-full"
									{field}
									bind:value={$form[field.id.value]}
									{...$constraints[field.id.value]}
								/>
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
			{:else}
				<div class="w-full container">
					<Alert color="green" class="m-auto text-center w-3/4">
						{$t('form submitted')}
					</Alert>
				</div>
			{/if}
		</section>
	</div>
	<section class="flex items-center justify-center py-6 gap-2">
		<a
			href="https://github.com/undb-xyz/undb"
			class="inline-flex gap-2 items-center text-sm text-gray-500 dark:text-white"
			target="_blank"
		>
			<img class="h-6 w-auto" src={logo} alt="undb" />
			<span> Powered by undb </span>
		</a>
	</section>
</main>
