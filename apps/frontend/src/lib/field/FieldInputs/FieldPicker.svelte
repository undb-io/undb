<script lang="ts">
	import type { IFieldType, IQueryFieldSchema } from '@undb/core'
	import { identity } from 'lodash-es'
	import FieldIcon from '../FieldIcon.svelte'
	import * as Select from '$lib/components/ui/select'

	export let value: string = ''

	export let selected: IQueryFieldSchema | undefined = undefined
	export let selectedId: string | undefined = undefined
	export let type: IFieldType | undefined = undefined
	export let readonly = false

	export let fields: IQueryFieldSchema[] = []
	export let filter: (field: IQueryFieldSchema) => boolean = identity

	$: filteredFields = fields.filter(filter)

	$: selected = value ? filteredFields.find((f) => f.id === value) : undefined
	$: selectedId = selected?.id
	$: type = selected?.type
</script>

<Select.Root bind:value disabled={readonly}>
	<Select.Trigger>
		<Select.Value />
	</Select.Trigger>
	<Select.Content>
		{#each filteredFields as field (field.id)}
			<Select.Item value={field.id} class="gap-2">
				<FieldIcon size={14} type={field.type} />
				<span class="text-xs">
					{field.name}
				</span>
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
