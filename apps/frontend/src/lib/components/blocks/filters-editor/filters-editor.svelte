<script lang="ts">
	import {
		TableDo,
		isEmptyFilterGroup,
		isMaybeFieldFilter,
		parseValidFilter,
		type IFilterGroup,
		type MaybeFilterGroup
	} from '@undb/table';
	import FilterField from './filter-field.svelte';
	import OpPicker from './op-picker.svelte';
	import FilterValue from './filter-value.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { FieldIdVo } from '@undb/table/src/modules/schema/fields/field-id.vo';
	import { cn } from '$lib/utils';
	import { PlusIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let table: TableDo;
	export let value: MaybeFilterGroup | undefined;

	const dispatch = createEventDispatcher();

	$: validValue = value ? parseValidFilter(table.schema.fieldMapById, value) : undefined;
	$: isEmpty = !validValue || isEmptyFilterGroup(validValue);

	$: children = value?.children ?? [];

	function addFilter() {
		const filter = { fieldId: undefined, op: undefined, value: undefined };
		if (!value) {
			value = { children: [filter], conjunction: 'and' };
		} else {
			value.children = [...value.children, filter];
		}
	}
</script>

<div class="space-y-2">
	<code class="block">
		{JSON.stringify(value, null, 2)}
	</code>
	{#if children.length}
		<div class="space-y-2">
			{#each children as child}
				<div class="flex items-center">
					{#if isMaybeFieldFilter(child)}
						<FilterField
							bind:value={child}
							class={cn(!!child.fieldId && 'rounded-r-none border-r-0')}
						/>
						{#if child.fieldId}
							{@const field = table.schema.getFieldById(new FieldIdVo(child.fieldId))}
							{#if field.isSome()}
								<OpPicker field={field.unwrap()} bind:value={child.op} class="rounded-l-none" />
								{#if child.op}
									<FilterValue field={field.unwrap()} bind:value={child.value} bind:op={child.op} />
								{/if}
							{/if}
						{/if}
					{/if}
				</div>
			{/each}
		</div>
	{/if}
	<div class="flex justify-between">
		<Button variant="ghost" size="xs" on:click={addFilter}>
			<PlusIcon class="mr-2 h-3 w-3" />
			Add Filter
		</Button>

		<Button size="xs" disabled={isEmpty} on:click={() => dispatch('submit', validValue)}>
			Submit
		</Button>
	</div>
</div>
