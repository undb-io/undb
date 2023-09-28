<script lang="ts">
	import { cn } from '$lib/utils'

	import type { LayoutData } from './$types'
	import CreateTable from '$lib/table/CreateTable.svelte'
	import { page } from '$app/stores'
	import { allBases, allTables, currentRecordId } from '$lib/store/table'
	import { goto } from '$app/navigation'
	import { browser } from '$app/environment'
	import logo from '$lib/assets/logo.svg'
	import { i18n, t } from '$lib/i18n'
	import { createMutation } from '@tanstack/svelte-query'
	import { createTableModal, importDataModal, importTemplate } from '$lib/store/modal'
	import { colors } from '$lib/field/helpers'
	import ImportData from '$lib/import/ImportData.svelte'
	import { copyText } from 'svelte-copy'
	import Cookies from 'js-cookie'
	import { changeThemeMode, sidebarCollapsed, theme } from '$lib/store/ui'
	import { DARK_THEME, LIGHT_THEME } from '$lib/store/ui.type'
	import TablesNav from '$lib/table/TablesNav.svelte'
	import { hasPermission } from '$lib/store/authz'
	import * as Sheet from '$lib/components/ui/sheet'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$components/ui/button'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import * as Avatar from '$lib/components/ui/avatar'
	import ImportTemplate from '$lib/template/ImportTemplate.svelte'
	import CreateBase from '$lib/base/CreateBase.svelte'
	import SelectTableMoveToBase from '$lib/base/SelectTableMoveToBase.svelte'
	import { toast } from 'svelte-sonner'

	$: navigation = [
		{
			name: $t('Dashboard', { ns: 'common' }),
			href: '/',
			icon: 'layout-dashboard',
			current: $page.url.pathname === '/',
		},
		{
			name: $t('Members', { ns: 'common' }),
			href: '/members',
			icon: 'users',
			current: $page.url.pathname === '/members',
		},
	]

	let sidebarOpen = false
	const setSidebarOpen = () => (sidebarOpen = true)

	export let data: LayoutData

	const token = Cookies.get('undb_auth')!

	const copyToken = () => {
		copyText(token)
		toast.success($t('COPIED', { ns: 'success' }))
	}

	$: tables = data.tables
	$: allTables.set(tables)
	$: allBases.set(data.bases.bases ?? [])
	$: me = data.me.me

	$: r = $page.url.searchParams.get('r')
	$: if (r) {
		currentRecordId.set(r)
	}
	$: if (browser && !$page.error) {
		if ($currentRecordId) {
			const search = $page.url.searchParams
			search.set('r', $currentRecordId)
			goto(`?${search.toString()}`, { invalidateAll: false })
		}
		if (!$currentRecordId) {
			goto($page.url.pathname, { invalidateAll: false })
		}
	}

	const logout = createMutation({
		mutationKey: ['logout'],
		mutationFn: () =>
			fetch('/api/auth/logout', {
				method: 'POST',
			}),
		async onSuccess(data, variables, context) {
			await goto('/login')
		},
	})
</script>

<div>
	<Sheet.Root bind:open={sidebarOpen}>
		<Sheet.Content class="lg:hidden w-4/5" side="left">
			<div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white pb-2 h-screen">
				<div class="flex h-12 shrink-0 items-center gap-2">
					<img class="h-6 w-auto" src={logo} alt="undb" />
					<p class="font-semibold select-none !text-primary-600">undb</p>
				</div>
				<nav class="flex flex-1 flex-col">
					<ul class="flex flex-1 flex-col gap-y-7">
						<li>
							<ul class="-mx-2 space-y-1">
								{#each navigation as item}
									<li>
										<a
											href={item.href}
											class={cn(
												item.current
													? 'bg-gray-50 text-indigo-600'
													: 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
												'group flex gap-x-3 rounded-md py-1 px-2 text-xs leading-6 font-semibold',
											)}
										>
											<div class="h-6 w-6 flex justify-center items-center">
												<i
													class={cn(
														item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
														'shrink-0 text-lg',
														`ti ti-${item.icon}`,
													)}
													aria-hidden="true"
												/>
											</div>

											{item.name}
										</a>
									</li>
								{/each}
							</ul>
						</li>
						<li>
							<div class="text-xs font-semibold leading-6 text-gray-400">{$t('Tables', { ns: 'common' })}</div>
							<TablesNav {tables} bases={data.bases.bases} />
						</li>
					</ul>
				</nav>
			</div>
		</Sheet.Content>
	</Sheet.Root>

	<div
		class={cn(
			'hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col h-screen transition',
			$sidebarCollapsed && 'translate-x-[-100%]',
		)}
	>
		<div
			class="flex flex-1 grow flex-col gap-y-0 overflow-hidden border-r border-gray-200 dark:border-gray-700 bg-white h-full group/main dark:bg-gray-800"
		>
			<div class="flex h-12 shrink-0 items-center px-6 justify-between">
				<div class="flex gap-2">
					<img class="h-6 w-auto" src={logo} alt="undb" />
					<p class="font-semibold select-none !text-primary-600 dark:!text-white">undb</p>
				</div>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<button on:click={() => ($sidebarCollapsed = true)}>
							<i
								class="ti ti-layout-sidebar-left-collapse text-xl text-gray-500 dark:hover:text-gray-100 opacity-0 group-hover/main:opacity-100 transition"
							/>
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content
						class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
					>
						<kbd> Command + b </kbd>
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
			<div class="border-b dark:border-gray-700">
				<ul class="px-6 -mx-2 space-y-1 py-2">
					{#each navigation as item}
						<li>
							<a
								href={item.href}
								class={cn(
									item.current
										? 'bg-primary/5 text-primary dark:text-gray-50 dark:bg-gray-700'
										: 'text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700',
									'group flex gap-x-3 rounded-md py-1 px-2 text-xs leading-6 font-semibold',
								)}
							>
								<div class="h-6 w-6 flex justify-center items-center">
									<i
										class={cn(
											item.current
												? 'text-primary dark:text-gray-50'
												: 'text-gray-400 group-hover:text-primary dark:group-hover:text-gray-100',
											'shrink-0 text-lg',
											`ti ti-${item.icon}`,
										)}
										aria-hidden="true"
									/>
								</div>
								{item.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<div class="px-6 py-4">
				<p class="text-sm font-normal leading-6 !text-gray-400">{$t('Tables', { ns: 'common' })}</p>
			</div>
			<nav class="flex flex-1 flex-col px-4 h-full overflow-y-auto">
				<TablesNav {tables} bases={data.bases.bases} />
			</nav>
			<ul class="flex flex-col border-t pt-4 space-y-2 dark:border-gray-700">
				<li class="px-6">
					<div class="flex w-full items-center">
						{#if $hasPermission('table:create')}
							<Button
								size="sm"
								class="w-full dark:border-0 dark:hover:border-primary-700  dark:hover:bg-primary-700 dark:focus:ring-primary-800 rounded-r-none border-r-0"
								variant="outline"
								on:click={() => createTableModal.open()}
							>
								{$t('Create New Table')}
							</Button>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Button
										size="sm"
										class="dark:border-0 dark:hover:border-primary-700 dark:hover:bg-primary-700  dark:focus:ring-primary-800 rounded-l-none"
										variant="outline"
									>
										<i class="ti ti-chevron-down" />
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Item class="gap-2" on:click={() => importDataModal.open()}>
										<i class="ti ti-csv" />
										<span>
											{$t('import data content')}
										</span>
									</DropdownMenu.Item>
									<DropdownMenu.Item class="gap-2" on:click={() => importTemplate.open()}>
										<i class="ti ti-csv" />
										<span>
											{$t('import template')}
										</span>
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{/if}
					</div>
				</li>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<button
							id="me-button"
							class="flex items-center gap-x-4 px-2 py-3 w-full text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-white transition"
						>
							<Avatar.Root>
								<Avatar.Image src={me?.avatar} alt={me?.username} />
								<Avatar.Fallback class={cn('text-white', colors[me.color])}>{me?.username.slice(0, 2)}</Avatar.Fallback>
							</Avatar.Root>

							<span class="sr-only">Your profile</span>
							<span aria-hidden="true">{me.username}</span>
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						{#if $hasPermission('openapi:list_api_token')}
							<DropdownMenu.Item class="gap-2" on:click={() => goto('/setting')}>
								<i class="ti ti-settings" />
								{$t('Settings', { ns: 'common' })}
							</DropdownMenu.Item>
						{/if}
						<DropdownMenu.Item class="gap-2" on:click={() => goto('/me')}>
							<i class="ti ti-user-circle" />
							{$t('Account Settings', { ns: 'auth' })}
						</DropdownMenu.Item>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class="gap-2">
								<i class="ti ti-world" />
								<span>
									{$t('language', { ns: 'common' })}
								</span>
							</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent>
								<DropdownMenu.Item class="flex justify-between gap-2" on:click={() => $i18n.changeLanguage('zh-CN')}>
									<span>简体中文</span>
									{#if $i18n.language === 'zh-CN'}
										<i class="ti ti-check" />
									{/if}
								</DropdownMenu.Item>
								<DropdownMenu.Item class="flex justify-between gap-2" on:click={() => $i18n.changeLanguage('en')}>
									<span>English</span>
									{#if $i18n.language === 'en'}
										<i class="ti ti-check" />
									{/if}
								</DropdownMenu.Item>
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>

						<DropdownMenu.Item class="gap-2" on:click={copyToken}>
							<i class="ti ti-copy" />
							{$t('Copy Auth Token', { ns: 'auth' })}
						</DropdownMenu.Item>
						<DropdownMenu.Item
							class="gap-2"
							on:click={() => {
								$theme = $theme === DARK_THEME ? LIGHT_THEME : DARK_THEME
								changeThemeMode($theme)
							}}
						>
							<i class="ti ti-sun-moon" />
							{#if $theme === DARK_THEME}
								{$t('Light Mode', { ns: 'auth' })}
							{:else}
								{$t('Dark Mode', { ns: 'auth' })}
							{/if}
						</DropdownMenu.Item>

						<DropdownMenu.Item class="gap-2 text-red-400" on:click={() => $logout.mutate()}>
							<i class="ti ti-logout" />
							<span>
								{$t('logout', { ns: 'auth' })}
							</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</ul>
		</div>
	</div>

	<div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-2 py-2 shadow-sm sm:px-6 lg:hidden">
		<button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" on:click={setSidebarOpen}>
			<i class="ti ti-menu-2" />
		</button>
		<div class="flex-1 text-sm font-semibold leading-6 text-gray-900">
			<img class="h-6 w-auto" src={logo} alt="undb" />
		</div>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="flex items-center gap-2">
				<button
					id="me-button"
					class="px-5 py-1 flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100 transition rounded-sm"
				>
					<Avatar.Root>
						<Avatar.Image src={me?.avatar} alt={me?.username} />
						<Avatar.Fallback class={cn('text-white', colors[me.color])}>{me?.username.slice(0, 2)}</Avatar.Fallback>
					</Avatar.Root>
					<span class="sr-only">Your profile</span>
					<span aria-hidden="true">{me.username}</span>
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Content class="w-56">
				{#if $hasPermission('openapi:list_api_token')}
					<DropdownMenu.Item class="gap-2" on:click={() => goto('/setting')}>
						<i class="ti ti-settings" />
						{$t('Settings', { ns: 'common' })}
					</DropdownMenu.Item>
				{/if}
				<DropdownMenu.Item class="gap-2" on:click={() => goto('/me')}>
					<i class="ti ti-settings" />
					<span>
						{$t('Account Settings', { ns: 'auth' })}
					</span>
				</DropdownMenu.Item>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="gap-2">
						<i class="ti ti-world" />
						{$t('language', { ns: 'common' })}
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item class="flex justify-between gap-2" on:click={() => $i18n.changeLanguage('zh-CN')}>
							<span>简体中文</span>
							{#if $i18n.language === 'zh-CN'}
								<i class="ti ti-check" />
							{/if}
						</DropdownMenu.Item>
						<DropdownMenu.Item class="flex justify-between gap-2" on:click={() => $i18n.changeLanguage('en')}>
							<span>English</span>
							{#if $i18n.language === 'en'}
								<i class="ti ti-check" />
							{/if}
						</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>

				<DropdownMenu.Item class="gap-2" on:click={copyToken}>
					<i class="ti ti-copy" />
					{$t('Copy Auth Token', { ns: 'auth' })}
				</DropdownMenu.Item>
				<DropdownMenu.Item
					class="gap-2"
					on:click={() => {
						$theme = $theme === DARK_THEME ? LIGHT_THEME : DARK_THEME
						changeThemeMode($theme)
					}}
				>
					<i class="ti ti-sun-moon" />
					{#if $theme === DARK_THEME}
						{$t('Light Mode', { ns: 'auth' })}
					{:else}
						{$t('Dark Mode', { ns: 'auth' })}
					{/if}
				</DropdownMenu.Item>
				<DropdownMenu.Item class="gap-2 text-red-400" on:click={() => $logout.mutate()}>
					<i class="ti ti-logout" />
					<span>
						{$t('logout', { ns: 'auth' })}
					</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<main class={cn('h-[100vh] transition-all', 'dark:!bg-slate-800', $sidebarCollapsed ? 'lg:pl-0' : 'lg:pl-72')}>
		<div class="h-full flex flex-col">
			<slot />
		</div>
	</main>
</div>

<CreateTable data={$page.data.form} />
<CreateBase />
<SelectTableMoveToBase />
<ImportData formData={$page.data.createTable} />
<ImportTemplate />
