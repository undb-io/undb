<script lang="ts">
	import { invalidate } from '$app/navigation'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { selectedForm } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { Card, P } from 'flowbite-svelte'

	const table = getTable()

	$: hiddenFields = $selectedForm?.getHiddenFields($table.schema.toIdMap()) ?? []

	const setFormFieldsVisibilityMutation = trpc().table.form.field.setVisibility.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const setFormFieldsVisibility = (fieldId: string) => {
		if (!$selectedForm) return
		$setFormFieldsVisibilityMutation.mutate({
			tableId: $table.id.value,
			formId: $selectedForm.id.value,
			visibility: { [fieldId]: false },
		})
	}
</script>

<P>{$t('Field')}</P>
<div class="space-y-2">
	{#each hiddenFields as field}
		<Card
			class="!py-2 !px-4 shadow-sm hover:shadow-md transition cursor-pointer hover:border-blue-500"
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
