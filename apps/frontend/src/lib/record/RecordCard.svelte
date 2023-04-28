<script lang="ts">
	import { t } from '$lib/i18n'
	import type { Record, ReferenceFieldTypes, TableSchema } from '@undb/core'
	import { Card } from 'flowbite-svelte'

	export let schema: TableSchema
	export let field: ReferenceFieldTypes
	export let record: Record | undefined

	$: value = record ? field.getForeignDisplayValues(record, schema) ?? [$t('unamed')] : []
</script>

{#if record}
	<Card {...$$restProps}>
		{value.toString()}
	</Card>
{/if}
