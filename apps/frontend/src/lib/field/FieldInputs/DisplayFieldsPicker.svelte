<script lang="ts">
	import * as Popover from '$lib/components/ui/popover'
	import { canDisplay, type IQueryFieldSchema } from '@undb/core'
	import FieldIcon from '../FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import Label from '$components/ui/label/label.svelte'
	import { Button } from '$components/ui/button'
	import { Badge } from '$components/ui/badge'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'

	export let group: string[] | undefined = []
	export let fields: IQueryFieldSchema[] = []
	export let tableName: string | undefined
	export let filter: (field: IQueryFieldSchema) => boolean = (f) => canDisplay(f.type)

	$: displayFields = fields.filter((f) => f.display)
	$: filteredFields = fields.filter(filter)
	$: selected = filteredFields.filter((f) => group?.includes(f.id))
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" class="max-w-max" {...$$restProps} builders={[builder]}>
			{@const first = filteredFields.find((f) => f.id === group?.[0])}
			{#if !group?.length}
				<span>
					{#if !displayFields.length}
						{$t('no display fields in', { table: tableName })}
					{:else}
						<Popover.Root>
							<Popover.Trigger>
								<span>{@html $t('Auto Display Field', { table: tableName })}</span>
							</Popover.Trigger>
							<Popover.Content class="w-64 text-sm font-light">
								<div class="flex flex-wrap gap-2">
									{#each displayFields as field}
										<Badge>{field.name}</Badge>
									{/each}
								</div>
							</Popover.Content>
						</Popover.Root>
					{/if}
				</span>
			{:else if group?.length === 1}
				<Badge variant="secondary">{first?.name ?? ''}</Badge>
			{:else}
				<Popover.Root>
					<Popover.Trigger>
						<span>
							<Badge variant="secondary" class="mr-2">{first?.name ?? ''}</Badge>{$t('and n more', {
								ns: 'common',
								n: group?.length,
							})}
						</span>
					</Popover.Trigger>
					<Popover.Content class="w-64 text-sm font-light">
						<div class="flex flex-wrap gap-2">
							{#each selected as field}
								<Badge>{field.name}</Badge>
							{/each}
						</div>
					</Popover.Content>
				</Popover.Root>
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		{#each filteredFields as field}
			{@const selected = !!group?.includes(field.id)}
			<DropdownMenu.Item>
				<Label class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer">
					<li class="w-full flex justify-between items-center text-gray-500 dark:text-gray-200">
						<div class="flex flex-1 items-center gap-2">
							<FieldIcon type={field.type} size={16} />
							<span>
								{field.name}
							</span>
						</div>
						{#if selected}
							<i class="ti ti-check text-sm" />
						{/if}
					</li>

					<input type="checkbox" value={field.id} bind:group />
				</Label>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
