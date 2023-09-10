<script lang="ts">
	import { cn } from '$lib/utils'
	import type { ReferenceField } from '@undb/core'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { getForeignTable } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import FieldIcon from '../FieldIcon.svelte'
	import { createFieldInitial, createFieldModal } from '$lib/store/modal'
	import { goto } from '$app/navigation'

	export let field: ReferenceField

	$: foreignTableId = field.foreignTableId.into()
	$: foreignTable = $getForeignTable(foreignTableId)
</script>

{#if foreignTable}
	<DropdownMenu.Item
		{...$$restProps}
		class={cn('flex items-center w-full', $$restProps.class)}
		on:click={() => goto(`/t/${foreignTableId}`)}
	>
		<i class="ti ti-external-link" />
		<span>
			{$t('jump to table', { name: foreignTable.name.value })}
		</span>
	</DropdownMenu.Item>
	<DropdownMenu.Sub>
		<DropdownMenu.SubTrigger class={cn('flex items-center w-full', $$restProps.class)}>
			<i class="ti ti-column-insert-right" />
			<span>
				{$t('insert refenrence looking field')}
			</span>
		</DropdownMenu.SubTrigger>
		<DropdownMenu.SubContent class="w-56">
			<DropdownMenu.Item
				{...$$restProps}
				on:click={() => {
					$createFieldInitial = {
						type: 'lookup',
						referenceFieldId: field.id.value,
					}
					createFieldModal.open()
				}}
			>
				<FieldIcon type="lookup" />
				<span>
					{$t('Insert Lookup Field')}
				</span>
			</DropdownMenu.Item>

			<DropdownMenu.Item
				{...$$restProps}
				on:click={() => {
					$createFieldInitial = {
						type: 'count',
						referenceFieldId: field.id.value,
					}
					createFieldModal.open()
				}}
			>
				<FieldIcon type="count" />
				<span>
					{$t('Insert Count Field')}
				</span>
			</DropdownMenu.Item>

			<DropdownMenu.Item
				{...$$restProps}
				on:click={() => {
					$createFieldInitial = {
						type: 'sum',
						referenceFieldId: field.id.value,
					}
					createFieldModal.open()
				}}
			>
				<FieldIcon type="sum" />
				<span>
					{$t('Insert Sum Field')}
				</span>
			</DropdownMenu.Item>

			<DropdownMenu.Item
				{...$$restProps}
				on:click={() => {
					$createFieldInitial = {
						type: 'average',
						referenceFieldId: field.id.value,
					}
					createFieldModal.open()
				}}
			>
				<FieldIcon type="average" />
				<span>
					{$t('Insert Average Field')}
				</span>
			</DropdownMenu.Item>

			<DropdownMenu.Item
				{...$$restProps}
				on:click={() => {
					$createFieldInitial = {
						type: 'min',
						referenceFieldId: field.id.value,
					}
					createFieldModal.open()
				}}
			>
				<FieldIcon type="min" />
				<span>
					{$t('Insert Min Field')}
				</span>
			</DropdownMenu.Item>

			<DropdownMenu.Item
				{...$$restProps}
				on:click={() => {
					$createFieldInitial = {
						type: 'max',
						referenceFieldId: field.id.value,
					}
					createFieldModal.open()
				}}
			>
				<FieldIcon type="max" />
				<span>
					{$t('Insert Max Field')}
				</span>
			</DropdownMenu.Item>
		</DropdownMenu.SubContent>
	</DropdownMenu.Sub>
{/if}
