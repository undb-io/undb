<script lang="ts">
	import { cn } from '$lib/utils'
	import { t } from '$lib/i18n'
	import type { Record, ReferenceFieldTypes, TableSchema } from '@undb/core'

	export let schema: TableSchema
	export let field: ReferenceFieldTypes
	export let record: Record | undefined

	$: value = record ? field.getForeignDisplayValues(record, schema) ?? [$t('unnamed')] : []
</script>

{#if record}
	<div
		class={cn('px-3 py-2 rounded-sm cursor-pointer border h-10 flex items-center dark:text-white', $$restProps.class)}
	>
		{value.toString()}
	</div>
{/if}
