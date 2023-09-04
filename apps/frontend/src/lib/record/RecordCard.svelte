<script lang="ts">
	import cx from 'classnames'
	import { t } from '$lib/i18n'
	import type { Record, ReferenceFieldTypes, TableSchema } from '@undb/core'

	export let schema: TableSchema
	export let field: ReferenceFieldTypes
	export let record: Record | undefined

	$: value = record ? field.getForeignDisplayValues(record, schema) ?? [$t('unnamed')] : []
</script>

{#if record}
	<div class={cx('p-3 rounded-sm cursor-pointer border', $$restProps.class)}>
		{value.toString()}
	</div>
{/if}
