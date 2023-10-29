<script lang="ts">
	import { cn } from '$lib/utils'
	import { sidebarCollapsed } from '$lib/store/ui'
	import { Button } from '$lib/components/ui/button'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import { getTable } from '$lib/store/table'
	import { t } from '$lib/i18n'

	const table = getTable()

	const download = async (type?: string) => {
		const searchParams = new URLSearchParams()
		if (type) {
			searchParams.set('type', type)
		}
		const res = await fetch(`/api/openapi/docs/tables/${$table.id.value}/export?` + searchParams.toString())
		const blob = await res.blob()
		const filename = res.headers.get('Content-Disposition')?.split('filename=')[1]
		const a = document.createElement('a')
		a.href = window.URL.createObjectURL(blob)
		if (filename) {
			a.download = filename
		}
		a.click()
		a.remove()
	}
</script>

<div class={cn('w-full py-3 border-b border-gray-200 dark:bg-gray-800', $sidebarCollapsed ? 'px-2' : 'px-5')}>
	<div class="flex items-center gap-2 w-full">
		{#if $sidebarCollapsed}
			<div class="ml-2">
				<Tooltip.Root>
					<Tooltip.Trigger>
						<button on:click={() => ($sidebarCollapsed = false)}>
							<i class="ti ti-layout-sidebar-left-expand text-lg text-gray-500" />
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content
						class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
					>
						<kbd> Command + b </kbd>
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		{/if}

		<div class="flex items-center justify-between w-full">
			<p class="font-bold dark:text-white">{$table.name.value} Open API</p>
			<div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button size="sm" class="gap-2">
							<i class="ti ti-chevron-down"></i>
							<span>
								{$t('download openapi')}
							</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Item on:click={() => download()}>
							{$t('openapi spec')}
						</DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => download('postman')}>
							{$t('postman collections')}
						</DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => download('typescript')}>
              Typescript
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</div>
</div>
