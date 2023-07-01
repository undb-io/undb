<script lang="ts">
	import { Anchor, Node } from 'svelvet'
	import type { Table as CoreTable } from '@undb/core'
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
	import FieldIcon from '$lib/field/FieldIcon.svelte'

	export let table: CoreTable
	export let position: { x: number; y: number } | undefined = undefined
	export let zIndex: number | undefined = undefined
</script>

<Node useDefaults id={table.id.value} label={table.name.value} {position} {zIndex}>
	<Anchor bgColor="transparent" id={table.id.value} input direction="west" />
	<div class="flex items-center justify-center p-1">{table.name.value}</div>

	<Table striped>
		<TableHead>
			<TableHeadCell>id</TableHeadCell>
			<TableHeadCell>{$t('Name', { ns: 'common' })}</TableHeadCell>
			<TableHeadCell>{$t('Type', { ns: 'common' })}</TableHeadCell>
		</TableHead>

		<TableBody tableBodyClass="divide-y">
			<TableBodyRow />
			{#each table.schema.fields as field}
				<TableBodyRow>
					<TableBodyCell>
						<div class="relative">
							{field.id.value}
							<div class="absolute left-[-25px] translate-y-[50%] top-0">
								{#if field.type === 'reference'}
									{@const foreignTableId = field.foreignTableId.into()}
									{#if foreignTableId}
										{#if field.isOneway}
											<Anchor id={field.id.value} output connections={[foreignTableId]} direction="west" />
										{:else if field.isTwoway}
											<Anchor
												id={field.id.value}
												connections={[[foreignTableId, field.symmetricReferenceFieldId?.value ?? '']]}
												direction="west"
											/>
										{/if}
									{/if}
								{/if}
							</div>
						</div>
					</TableBodyCell>
					<TableBodyCell>{field.name.value}</TableBodyCell>
					<TableBodyCell>
						<div class="flex items-center gap-2">
							<FieldIcon type={field.type} />
							<span class="inline-block">
								{$t(field.type)}
							</span>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</Node>
