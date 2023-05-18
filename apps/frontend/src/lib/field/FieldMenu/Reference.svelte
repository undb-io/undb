<script lang="ts">
	import cx from 'classnames'
	import type { ReferenceField } from '@undb/core'
	import { DropdownItem } from 'flowbite-svelte'
	import { getForeignTable } from '$lib/store/table'
	import { t } from '$lib/i18n'

	export let field: ReferenceField

	$: foreignTableId = field.foreignTableId.into()
	$: foreignTable = $getForeignTable(foreignTableId)
</script>

{#if foreignTable}
	<DropdownItem
		{...$$restProps}
		href={`/t/${foreignTableId}`}
		class={cx('flex items-center w-full', $$restProps.class)}
	>
		<i class="ti ti-external-link" />
		<span>
			{$t('jump to table', { name: foreignTable.name.value })}
		</span>
	</DropdownItem>
{/if}
