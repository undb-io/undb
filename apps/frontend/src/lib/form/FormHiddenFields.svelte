<script lang="ts">
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { selectedForm } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { Card, P } from 'flowbite-svelte'

	const table = getTable()

	$: hiddenFields = $selectedForm?.getHiddenFields($table.schema.toIdMap()) ?? []
</script>

<P>{$t('Field')}</P>
<div class="space-y-2">
	{#each hiddenFields as field}
		<Card class="!py-2 !px-4 shadow-sm hover:shadow-md transition cursor-pointer hover:border-blue-500">
			<div class="flex gap-2 items-center">
				<FieldIcon type={field.type} />
				<span>
					{field.name.value}
				</span>
			</div>
		</Card>
	{/each}
</div>
