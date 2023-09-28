<script lang="ts">
	import { page } from '$app/stores'
	import { t } from '$lib/i18n'
	import { getTable, shareTarget } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import * as Alert from '$lib/components/ui/alert'
	import { keys, pick } from 'lodash-es'
	import { superForm } from 'sveltekit-superforms/client'
	import logo from '$lib/assets/logo.svg'
	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { RecordFactory, RecordId, WithRecordId } from '@undb/core'
	import { me } from '$lib/store/me'
	import FormSubmitItem from '$lib/form/FormSubmitItem.svelte'
	import { Button } from '$components/ui/button'
	import { toast } from 'svelte-sonner'

	export let data: PageData

	const table = getTable()
	let submitted = false

	const createShareRecord = trpc().share.createRecord.mutation({
		onSuccess(data, variables, context) {
			submitted = true
			toast.success($t('TABLE.FORM_SUBMITTED', { ns: 'success' }))
		},
		onError(error) {
			toast.error(error.message)
		},
	})

	const superFrm = superForm(data.createShareRecord, {
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
	const { form, enhance, delayed, submitting, tainted } = superFrm

	onMount(() => {
		$tainted = undefined
	})

	$: f = $table.forms.getById($page.params.formId).unwrap()

	$: fields = f.getNotHiddenFields($table.schema)

	$: values = pick($form, keys($tainted))

	const id = RecordId.create()
	$: tempRecord = RecordFactory.temp($table, values, $me.userId, new WithRecordId(id))
</script>

<main class="bg-primary-50 h-screen w-screen flex flex-col dark:bg-gray-500">
	<div class="container mx-auto w-full flex flex-col gap-3 items-center justify-center flex-1 h-full p-6 pb-2">
		<section
			class="border dark:border-gray-700 rounded-md bg-white py-8 px-6 shadow-lg w-full max-w-5xl dark:bg-gray-600 dark:text-gray-200 max-h-full overflow-y-auto"
		>
			<h3 class="text-lg text-center mb-5">{f.name.value}</h3>
			{#if !submitted}
				<form id="createShareRecord" class="space-y-5" method="POST" use:enhance>
					{#each fields as field}
						<FormSubmitItem form={f} {field} {tempRecord} {superFrm} />
					{/each}

					<div class="w-full flex justify-end gap-2">
						<Button class="gap-2" type="submit" form="createShareRecord" disabled={$submitting}>
							{#if $delayed}
								<i class="ti ti-rotate animate-spin"></i>
							{:else}
								<i class="ti ti-row-insert-bottom" />
							{/if}
							{$t('Create New Record')}
						</Button>
					</div>
				</form>
			{:else}
				<div class="w-full container">
					<Alert.Root>
						<Alert.Title>
							{$t('form submitted')}
						</Alert.Title>
					</Alert.Root>
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
