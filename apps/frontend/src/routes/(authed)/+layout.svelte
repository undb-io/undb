<script lang="ts">
	import cx from 'classnames'

	import { Dialog, DialogOverlay, TransitionChild, TransitionRoot } from '@rgossiaux/svelte-headlessui'
	import type { LayoutData } from './$types'
	import CreateTable from '$lib/table/CreateTable.svelte'
	import { Avatar, Button, ButtonGroup, Chevron, Dropdown, DropdownItem, P, Toast, Tooltip } from 'flowbite-svelte'
	import { page } from '$app/stores'
	import { allTables, currentRecordId } from '$lib/store/table'
	import { goto } from '$app/navigation'
	import { browser } from '$app/environment'
	import logo from '$lib/assets/logo.svg'
	import { i18n, t } from '$lib/i18n'
	import { createMutation } from '@tanstack/svelte-query'
	import { createTableModal, importCSVModal } from '$lib/store/modal'
	import { colors } from '$lib/field/helpers'
	import ImportCsv from '$lib/import/ImportCSV.svelte'
	import { copyText } from 'svelte-copy'
	import Cookies from 'js-cookie'
	import { slide } from 'svelte/transition'
	import { sidebarCollapsed } from '$lib/store/ui'

	$: navigation = [
		{ name: $t('Tables', { ns: 'common' }), href: '/', icon: 'table', current: $page.url.pathname === '/' },
		{
			name: $t('Members', { ns: 'common' }),
			href: '/members',
			icon: 'users',
			current: $page.url.pathname === '/members',
		},
	]

	let sidebarOpen = false
	const setSidebarOpen = () => (sidebarOpen = true)
	const setSidebarClose = () => (sidebarOpen = false)

	export let data: LayoutData

	let copied = false
	const token = Cookies.get('undb_auth')!

	const copyToken = () => {
		copyText(token)
		copied = true
		setTimeout(() => {
			copied = false
		}, 2000)
	}

	$: tables = data.tables
	$: allTables.set(tables)
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
	<TransitionRoot show={sidebarOpen}>
		<Dialog as="div" class="relative z-30 lg:hidden" bind:open={sidebarOpen} on:close={setSidebarOpen}>
			<TransitionChild
				enter="transition-opacity ease-linear duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity ease-linear duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div class="fixed inset-0 bg-gray-900/80" />
			</TransitionChild>

			<div class="fixed inset-0 flex">
				<TransitionChild
					enter="transition ease-in-out duration-300 transform"
					enterFrom="-translate-x-full"
					enterTo="translate-x-0"
					leave="transition ease-in-out duration-300 transform"
					leaveFrom="translate-x-0"
					leaveTo="-translate-x-full"
				>
					<DialogOverlay class="relative mr-16 flex w-full max-w-xs flex-1">
						<TransitionChild
							enter="ease-in-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in-out duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div class="absolute left-full top-0 flex w-16 justify-center pt-5">
								<button type="button" class="-m-2.5 p-2.5" on:click={setSidebarClose}>
									<span class="sr-only">Close sidebar</span>
								</button>
							</div>
						</TransitionChild>
						<div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 h-screen">
							<div class="flex h-12 shrink-0 items-center px-6 gap-2">
								<img class="h-6 w-auto" src={logo} alt="undb" />
								<P size="lg" class="font-semibold select-none !text-blue-600">undb</P>
							</div>
							<nav class="flex flex-1 flex-col">
								<ul class="flex flex-1 flex-col gap-y-7">
									<li>
										<ul class="-mx-2 space-y-1">
											{#each navigation as item}
												<li>
													<a
														href={item.href}
														class={cx(
															item.current
																? 'bg-gray-50 text-indigo-600'
																: 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
															'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
														)}
													>
														<div class="h-6 w-6 flex justify-center items-center">
															<i
																class={cx(
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
										<ul class="-mx-2 mt-2 space-y-1">
											{#each tables as table}
												<li>
													<a
														href={`/t/${table.id}`}
														class={cx(
															'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
															'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
														)}
													>
														<span
															class={cx(
																'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
																'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
															)}
														>
															{table.name.slice(0, 1)}
														</span>
														<span class="truncate">{table.name}</span>
													</a>
												</li>
											{/each}
										</ul>
									</li>
								</ul>
							</nav>
						</div>
					</DialogOverlay>
				</TransitionChild>
			</div>
		</Dialog>
	</TransitionRoot>

	<div
		class={cx(
			'hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col h-screen transition',
			$sidebarCollapsed && 'translate-x-[-100%]',
		)}
	>
		<div class="flex flex-1 grow flex-col gap-y-0 overflow-hidden border-r border-gray-200 bg-white h-full group/main">
			<div class="flex h-12 shrink-0 items-center px-6 justify-between">
				<div class="flex gap-2">
					<img class="h-6 w-auto" src={logo} alt="undb" />
					<P size="lg" class="font-semibold select-none !text-blue-600">undb</P>
				</div>
				<button on:click={() => ($sidebarCollapsed = true)}>
					<i
						class="ti ti-layout-sidebar-left-collapse text-xl text-gray-500 opacity-0 group-hover/main:opacity-100 transition"
					/>
				</button>
				<Tooltip placement="bottom">meta + b</Tooltip>
			</div>
			<div class="border-b">
				<ul class="px-6 -mx-2 space-y-1 py-2">
					{#each navigation as item}
						<li>
							<a
								href={item.href}
								class={cx(
									item.current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
									'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
								)}
							>
								<div class="h-6 w-6 flex justify-center items-center">
									<i
										class={cx(
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
			</div>
			<div class="px-6 py-4">
				<P class="text-sm font-normal leading-6 !text-gray-400">{$t('Tables', { ns: 'common' })}</P>
			</div>
			<nav class="flex flex-1 flex-col px-6 h-full overflow-y-auto">
				<ul class="-mx-2 space-y-1 pb-2">
					{#each tables as table}
						<li>
							<a
								href={`/t/${table.id}`}
								class={cx(
									table.id === $page.params.tableId
										? 'bg-blue-50 text-indigo-600'
										: 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
									'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
								)}
							>
								<span
									class={cx(
										table.id === $page.params.tableId
											? 'bg-blue-50 text-indigo-600'
											: 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',

										' border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
										'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
									)}
								>
									{table.name.slice(0, 1)}
								</span>
								<span class="truncate">{table.name}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>
			<ul class="flex flex-col border-t pt-4 space-y-2">
				<li class="px-6">
					<ButtonGroup class="w-full">
						<Button size="xs" class="w-full" outline on:click={() => createTableModal.open()}>
							{$t('Create New Table')}
						</Button>
						<Button size="xs" outline>
							<i class="ti ti-chevron-down" />
						</Button>
						<Dropdown placement="top" class="w-[200px]">
							<DropdownItem on:click={() => importCSVModal.open()} class="flex items-center gap-2">
								<i class="ti ti-csv" />
								<span>
									{$t('import csv')}
								</span>
							</DropdownItem>
						</Dropdown>
					</ButtonGroup>
				</li>

				<button
					id="me-button"
					class="w-full flex items-center gap-x-4 px-6 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
				>
					{#if me.avatar}
						<Avatar src={me.avatar} />
					{:else}
						<Avatar class={cx('text-white', colors[me.color])}>{me.username.slice(0, 2)}</Avatar>
					{/if}
					<span class="sr-only">Your profile</span>
					<span aria-hidden="true">{me.username}</span>
				</button>

				<Dropdown
					triggeredBy="#me-button"
					placement="top"
					frameClass="w-full"
					class="w-full shadow-sm border border-gray-100"
				>
					<DropdownItem href="/me">
						<i class="ti ti-settings" />
						{$t('Setting', { ns: 'auth' })}
					</DropdownItem>
					<DropdownItem class="flex items-center justify-between">
						<Chevron placement="right">
							<div>
								<i class="ti ti-world" />
								{$t('language', { ns: 'common' })}
							</div>
						</Chevron>
					</DropdownItem>
					<Dropdown placement="right-start">
						<DropdownItem class="flex justify-between" on:click={() => $i18n.changeLanguage('zh-CN')}>
							<span>简体中文</span>
							{#if $i18n.language === 'zh-CN'}
								<i class="ti ti-check" />
							{/if}
						</DropdownItem>
						<DropdownItem class="flex justify-between" on:click={() => $i18n.changeLanguage('en')}>
							<span>English</span>
							{#if $i18n.language === 'en'}
								<i class="ti ti-check" />
							{/if}
						</DropdownItem>
					</Dropdown>

					<DropdownItem on:click={copyToken}>
						<i class="ti ti-copy" />
						{$t('Copy Auth Token', { ns: 'auth' })}
					</DropdownItem>
					<DropdownItem>
						<button on:click={() => $logout.mutate()} class="w-full h-full text-left text-red-400" type="submit">
							<i class="ti ti-logout" />
							{$t('logout', { ns: 'auth' })}
						</button>
					</DropdownItem>
				</Dropdown>
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
		<button id="me-button" class="flex items-center gap-x-4 p-0 text-sm font-semibold leading-6 text-gray-900">
			{#if me.avatar}
				<Avatar src={me.avatar} />
			{:else}
				<Avatar class={cx('text-white', colors[me.color])}>{me.username.slice(0, 2)}</Avatar>
			{/if}
			<span class="sr-only">Your profile</span>
			<span aria-hidden="true">{me.username}</span>
		</button>

		<Dropdown triggeredBy="#me-button" placement="bottom" class="w-48 shadow-sm border border-gray-100">
			<DropdownItem href="/me">
				<i class="ti ti-settings" />
				{$t('Setting', { ns: 'auth' })}
			</DropdownItem>
			<DropdownItem class="flex items-center justify-between">
				<Chevron placement="right">
					<div>
						<i class="ti ti-world" />
						{$t('language', { ns: 'common' })}
					</div>
				</Chevron>
			</DropdownItem>
			<Dropdown placement="left-start">
				<DropdownItem class="flex justify-between" on:click={() => $i18n.changeLanguage('zh-CN')}>
					<span>简体中文</span>
					{#if $i18n.language === 'zh-CN'}
						<i class="ti ti-check" />
					{/if}
				</DropdownItem>
				<DropdownItem class="flex justify-between" on:click={() => $i18n.changeLanguage('en')}>
					<span>English</span>
					{#if $i18n.language === 'en'}
						<i class="ti ti-check" />
					{/if}
				</DropdownItem>
			</Dropdown>

			<DropdownItem on:click={copyToken}>
				<i class="ti ti-copy" />
				{$t('Copy Auth Token', { ns: 'auth' })}
			</DropdownItem>
			<DropdownItem>
				<button on:click={() => $logout.mutate()} class="w-full h-full text-left text-red-400" type="submit">
					<i class="ti ti-logout" />
					{$t('logout', { ns: 'auth' })}
				</button>
			</DropdownItem>
		</Dropdown>
	</div>

	<main class={cx('h-[100vh] transition-all', $sidebarCollapsed ? 'lg:pl-0' : 'lg:pl-72')}>
		<div class="h-full flex flex-col">
			<slot />
		</div>
	</main>

	{#if $createTableModal.open}
		<CreateTable data={$page.data.form} />
	{/if}

	{#if $importCSVModal.open}
		<ImportCsv />
	{/if}
</div>

<Toast color="green" transition={slide} position="top-right" class="z-[99999]" bind:open={copied}>
	<svelte:fragment slot="icon">
		<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
				clip-rule="evenodd"
			/></svg
		>
		<span class="sr-only">Check icon</span>
	</svelte:fragment>
	{$t('Copied', { ns: 'common' })}
</Toast>
