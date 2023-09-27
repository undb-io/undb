<script lang="ts">
	import * as Popover from '$lib/components/ui/popover'
	import { canDisplay, type IQueryFieldSchema } from '@undb/core'
	import FieldIcon from '../FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import Label from '$components/ui/label/label.svelte'
	import { Button } from '$components/ui/button'
	import { Badge } from '$components/ui/badge'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as HoverCard from '$lib/components/ui/hover-card'

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
		<Button variant="outline" class="max-w-max" {...$$restProps} builders={[builder]} type="button">
			{@const first = filteredFields.find((f) => f.id === group?.[0])}
			{#if !group?.length}
				<span>
					{#if !displayFields.length}
						{$t('no display fields in', { table: tableName })}
					{:else}
						<HoverCard.Root openDelay={10} closeDelay={10}>
							<HoverCard.Trigger>
								<span>{@html $t('Auto Display Field', { table: tableName })}</span>
							</HoverCard.Trigger>
							<HoverCard.Content class="w-64 text-sm font-light">
								<div class="flex flex-wrap gap-2">
									{#each displayFields as field}
										<Badge variant="secondary" class="gap-2">
											<FieldIcon type={field.type} />
											<span>
												{field.name}
											</span>
										</Badge>
									{/each}
								</div>
							</HoverCard.Content>
						</HoverCard.Root>
					{/if}
				</span>
			{:else if group?.length === 1}
				<Badge variant="secondary" class="gap-2">
					{#if first}
						<FieldIcon type={first.type} />
						<span>
							{first.name}
						</span>
					{/if}
				</Badge>
			{:else}
				<HoverCard.Root openDelay={10} closeDelay={10}>
					<HoverCard.Trigger>
						<span>
							<Badge variant="secondary" class="mr-2 gap-2">
								{#if first}
									<FieldIcon type={first.type} />
									<span>
										{first.name}
									</span>
								{/if}
							</Badge>
							<span>
								{$t('and n more', {
									ns: 'common',
									n: group?.length,
								})}
							</span>
						</span>
					</HoverCard.Trigger>
					<HoverCard.Content class="w-64 text-sm font-light">
						<div class="flex flex-wrap gap-2">
							{#each selected as field}
								<Badge variant="secondary" class="gap-2">
									<FieldIcon type={field.type} />
									<span>
										{field.name}
									</span>
								</Badge>
							{/each}
						</div>
					</HoverCard.Content>
				</HoverCard.Root>
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		{#each filteredFields as field}
			{@const selected = !!group?.includes(field.id)}
			<DropdownMenu.Item on:click={(e) => e.preventDefault()}>
				<Label class="hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer flex w-full">
					<li class="w-full flex justify-between items-center text-gray-800 dark:text-gray-200">
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

					<input type="checkbox" class="hidden" value={field.id} bind:group />
				</Label>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
