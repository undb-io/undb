<script lang="ts">
	import {
		TableDo,
		isMaybeFieldFilter,
		parseValidFilter,
		type MaybeFilterGroup
	} from '@undb/table';
	import FilterField from './filter-field.svelte';
	import OpPicker from './op-picker.svelte';
	import FilterValue from './filter-value.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { FieldIdVo } from '@undb/table/src/modules/schema/fields/field-id.vo';
	import { cn } from '$lib/utils';
	import { GripVertical, PlusIcon, Trash2Icon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { SortableList } from '@jhubbardsf/svelte-sortablejs';
	import { type Writable } from 'svelte/store';
	import Input from '$lib/components/ui/input/input.svelte';
	import ConjunctionPicker from './conjunction-picker.svelte';

	export let table: TableDo;
	export let value: Writable<MaybeFilterGroup>;

	const dispatch = createEventDispatcher();

	$: validValue = $value ? parseValidFilter(table.schema.fieldMapById, $value) : undefined;

	$: children = $value?.children ?? [];

	let el: HTMLDivElement;

	function addFilter() {
		const filter = {
			fieldId: table.schema.fields.at(0)?.id.value,
			op: undefined,
			value: undefined
		};
		if (!$value) {
			value.set({ children: [filter], conjunction: 'and' });
		} else {
			value.update((v) => {
				if (v) {
					v.children = [...v.children, filter];
				}
				return v;
			});
		}
	}

	function removeFilter(index: number) {
		if ($value) {
			$value.children.splice(index, 1);
			value.set($value);
		}
	}
</script>

<div class="space-y-2">
	{#if children.length}
		<SortableList class="space-y-2 p-4 pb-2" animation={200}>
			{#each children as child, i}
				<div class="grid grid-cols-12 items-center gap-2">
					{#if i === 0}
						<div class="col-span-2 text-center text-xs">Where</div>
					{:else}
						<ConjunctionPicker
							disabled={i !== 1}
							class="col-span-2 text-center text-xs"
							bind:value={$value.conjunction}
						/>
					{/if}
					<div class="col-span-9 grid grid-cols-12 items-center">
						{#if isMaybeFieldFilter(child)}
							<FilterField
								bind:value={child}
								class={cn(!!child.fieldId && 'col-span-4 rounded-r-none border-r-0')}
							/>
							{@const field = child.fieldId
								? table.schema.getFieldById(new FieldIdVo(child.fieldId)).into(undefined)
								: undefined}
							<OpPicker {field} bind:value={child.op} class="col-span-3 rounded-l-none" />
							<FilterValue
								{field}
								bind:value={child.value}
								bind:op={child.op}
								class="col-span-5 text-xs font-medium"
							/>
						{/if}
					</div>
					<div class="col-span-1 flex items-center gap-2">
						<button on:click={() => removeFilter(i)}>
							<Trash2Icon class="text-muted-foreground h-3 w-3" />
						</button>
						<button class="handler">
							<GripVertical class="text-muted-foreground h-3 w-3" />
						</button>
					</div>
				</div>
			{/each}
		</SortableList>
	{/if}
	<div class={cn('flex justify-between border-t px-4', children.length ? 'py-2' : 'py-4')}>
		<Button variant="ghost" size="xs" on:click={addFilter}>
			<PlusIcon class="mr-2 h-3 w-3" />
			Add Filter
		</Button>

		<Button size="xs" on:click={() => dispatch('submit', validValue)}>Submit</Button>
	</div>
</div>
