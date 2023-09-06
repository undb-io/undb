<script lang="ts">
	import { Anchor, Node } from 'svelvet'
	import type { Table as CoreTable } from '@undb/core'
	import * as Table from '$lib/components/ui/table'
	import { t } from '$lib/i18n'
	import FieldIcon from '$lib/field/FieldIcon.svelte'

	export let table: CoreTable
	export let position: { x: number; y: number } | undefined = undefined
	export let zIndex: number | undefined = undefined
</script>

<Node useDefaults id={table.id.value} label={table.name.value} {position} {zIndex} selectionColor="#2563eb">
	<Anchor bgColor="transparent" id={table.id.value} input direction="west" />
	<div class="flex items-center justify-center p-1">{table.name.value}</div>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>id</Table.Head>
				<Table.Head>{$t('Name', { ns: 'common' })}</Table.Head>
				<Table.Head>{$t('Type', { ns: 'common' })}</Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			<Table.Row />
			{#each table.schema.fields as field}
				<Table.Row>
					<Table.Cell>
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
					</Table.Cell>
					<Table.Cell>{field.name.value}</Table.Cell>
					<Table.Cell>
						<div class="flex items-center gap-2">
							<FieldIcon type={field.type} />
							<span class="inline-block">
								{$t(field.type)}
							</span>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Node>
