<script lang="ts">
	import type { IFieldType, IQueryFieldSchema } from '@undb/core'
	import { identity } from 'lodash-es'
	import FieldIcon from '../FieldIcon.svelte'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$components/ui/button'
	import { t } from '$lib/i18n'

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

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder disabled={readonly}>
		<Button variant="outline" builders={[builder]} type="button" {...$$restProps}>
			{#if selected}
				<span class="inline-flex gap-2 items-center text-sm truncate">
					<FieldIcon type={selected.type} />
					<span>
						{selected.name}
					</span>
				</span>
			{:else}
				<span class="text-sm text-gray-300 font-normal">
					{$t('select field')}
				</span>
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.RadioGroup bind:value>
			{#each filteredFields as field (field.id)}
				<DropdownMenu.RadioItem value={field.id} class="gap-2">
					<FieldIcon size={14} type={field.type} />
					<span class="text-xs">
						{field.name}
					</span>
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
