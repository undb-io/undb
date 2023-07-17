<script lang="ts">
	import { invalidate } from '$app/navigation'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { selectedForm } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { Button, ButtonGroup, Card, P } from 'flowbite-svelte'

	const table = getTable()

	$: hiddenFields = $selectedForm?.getHiddenFields($table.schema) ?? []
	$: notHiddenFields = $selectedForm?.getNotHiddenFields($table.schema) ?? []

	const setFormFieldsVisibilityMutation = trpc().table.form.field.setVisibility.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const hideAll = () => {
		if (!$selectedForm) return
		const visibility = notHiddenFields.reduce((prev, curr) => {
			prev[curr.id.value] = true
			return prev
		}, {} as Record<string, true>)
		$setFormFieldsVisibilityMutation.mutate({
			tableId: $table.id.value,
			formId: $selectedForm.id.value,
			visibility,
		})
	}

	const showAll = () => {
		if (!$selectedForm) return
		const visibility = hiddenFields.reduce((prev, curr) => {
			prev[curr.id.value] = false
			return prev
		}, {} as Record<string, false>)
		$setFormFieldsVisibilityMutation.mutate({
			tableId: $table.id.value,
			formId: $selectedForm.id.value,
			visibility,
		})
	}

	const setFormFieldsVisibility = (fieldId: string) => {
		if (!$selectedForm) return
		$setFormFieldsVisibilityMutation.mutate({
			tableId: $table.id.value,
			formId: $selectedForm.id.value,
			visibility: { [fieldId]: false },
		})
	}
</script>

<div class="mb-2 flex justify-between">
	<P>{$t('Field')}</P>
	<ButtonGroup>
		{#if notHiddenFields.length}
			<Button color="alternative" size="xs" class="inline-flex gap-2 items-center" on:click={hideAll}>
				<i class="ti ti-eye-closed" />
				{$t('hide form all')}
			</Button>
		{/if}
		{#if hiddenFields.length}
			<Button color="alternative" size="xs" class="inline-flex gap-2 items-center" on:click={showAll}>
				<i class="ti ti-eye" />
				{$t('show form all')}
			</Button>
		{/if}
	</ButtonGroup>
</div>
<div class="space-y-2">
	{#each hiddenFields as field}
		<Card
			class="!py-2 !px-4 shadow-sm hover:shadow-md transition cursor-pointer hover:border-blue-500 !max-w-none"
			on:click={() => setFormFieldsVisibility(field.id.value)}
		>
			<div class="flex gap-2 items-center">
				<FieldIcon type={field.type} />
				<span>
					{field.name.value}
				</span>
			</div>
		</Card>
	{/each}
</div>
