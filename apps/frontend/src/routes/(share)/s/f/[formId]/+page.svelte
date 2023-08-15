<script lang="ts">
	import { page } from '$app/stores'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { getTable, shareTarget } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { Alert, Button, Heading, Label, Spinner, Toast } from 'flowbite-svelte'
	import { keys, pick } from 'lodash-es'
	import { superForm } from 'sveltekit-superforms/client'
	import logo from '$lib/assets/logo.svg'
	import { slide } from 'svelte/transition'
	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { RecordFactory } from '@undb/core'
	import { me } from '$lib/store/me'

	export let data: PageData

	const table = getTable()
	let submitted = false

	const createShareRecord = trpc().share.createRecord.mutation({
		onSuccess(data, variables, context) {
			submitted = true
		},
	})

	const { form, enhance, constraints, delayed, submitting, tainted } = superForm(data.createShareRecord, {
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

	onMount(() => {
		$tainted = undefined
	})

	$: f = $table.forms.getById($page.params.formId).unwrap()

	$: fields = f.getNotHiddenFields($table.schema)

	$: values = pick($form, keys($tainted))

	$: tempRecord = RecordFactory.temp($table, values, $me.userId)
</script>

<main class="bg-blue-50 h-screen w-screen flex flex-col dark:bg-gray-500">
	<div class="container mx-auto w-full flex flex-col gap-3 items-center justify-center flex-1 h-full p-6 pb-2">
		<section
			class="border dark:border-gray-700 rounded-md bg-white py-8 px-6 shadow-lg w-full max-w-5xl dark:bg-gray-600 dark:text-gray-200 max-h-full overflow-y-auto"
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
	</div>
</main>

{#if $createShareRecord.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$createShareRecord.error.message}
		</span>
	</Toast>
{/if}
