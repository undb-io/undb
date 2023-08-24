<script lang="ts">
	import { t } from '$lib/i18n'
	import type { Record, ReferenceFieldTypes, TableSchema } from '@undb/core'
	import * as Card from '$lib/components/ui/card'

	export let schema: TableSchema
	export let field: ReferenceFieldTypes
	export let record: Record | undefined

	$: value = record ? field.getForeignDisplayValues(record, schema) ?? [$t('unnamed')] : []
</script>

{#if record}
	<Card.Root {...$$restProps}>
		{value.toString()}
	</Card.Root>
{/if}
