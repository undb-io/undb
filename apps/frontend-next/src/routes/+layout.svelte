<script lang="ts">
	import cx from 'classnames'
	import '../app.postcss'

	import { Dialog, DialogOverlay, TransitionChild, TransitionRoot } from '@rgossiaux/svelte-headlessui'
	import { Bars3, Users, TableCells, XMark, Plus } from 'svelte-heros-v2'
	import type { LayoutData } from './$types'
	import CreateTable from '$lib/table/CreateTable.svelte'
	import { Button } from 'flowbite-svelte'
	import { createTableHidden } from '$lib/store'
	import { page } from '$app/stores'

	const navigation = [
		{ name: 'Tables', href: '/', icon: TableCells, current: $page.url.pathname === '/' },
		{ name: 'Members', href: '/members', icon: Users, current: false },
	]

	let sidebarOpen = false
	const setSidebarOpen = () => (sidebarOpen = true)
	const setSidebarClose = () => (sidebarOpen = false)

	export let data: LayoutData

	$: tables = data.tables
</script>

<div>
	<TransitionRoot show={sidebarOpen}>
		<Dialog as="div" class="relative z-30 lg:hidden" on:close={setSidebarOpen}>
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
									<XMark class="h-6 w-6 text-white" aria-hidden="true" />
								</button>
							</div>
						</TransitionChild>
						<div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
							<div class="flex h-16 shrink-0 items-center">
								<img
									class="h-8 w-auto"
									src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
									alt="Your Company"
								/>
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
														<svelte:component
															this={item.icon}
															class={cx(
																item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
																'h-6 w-6 shrink-0',
															)}
															aria-hidden="true"
														/>
														{item.name}
													</a>
												</li>
											{/each}
										</ul>
									</li>
									<li>
										<div class="text-xs font-semibold leading-6 text-gray-400">tables</div>
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

	<div class="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
		<div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
			<div class="flex h-16 shrink-0 items-center">
				<img
					class="h-8 w-auto"
					src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
					alt="Your Company"
				/>
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
										<svelte:component
											this={item.icon}
											class={cx(
												item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
												'h-6 w-6 shrink-0',
											)}
											aria-hidden="true"
										/>
										{item.name}
									</a>
								</li>
							{/each}
						</ul>
					</li>
					<li>
						<div class="text-xs font-semibold leading-6 text-gray-400">tables</div>
						<ul class="-mx-2 mt-2 space-y-1">
							{#each tables as table}
								<li>
									<a
										href={`/t/${table.id}`}
										class={cx(
											table.id === $page.params.tableId
												? 'bg-gray-50 text-indigo-600'
												: 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
											'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
										)}
									>
										<span
											class={cx(
												table.id === $page.params.tableId
													? 'bg-gray-50 text-indigo-600'
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

						<Button size="xs" class="w-full mt-2" outline on:click={() => createTableHidden.set(false)}>
							<Plus size="16" />
							Create New Table</Button
						>
					</li>
					<li class="-mx-6 mt-auto">
						<a
							href="#"
							class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
						>
							<img
								class="h-8 w-8 rounded-full bg-gray-50"
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
							/>
							<span class="sr-only">Your profile</span>
							<span aria-hidden="true">Tom Cook</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</div>

	<div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
		<button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" on:click={setSidebarOpen}>
			<span class="sr-only">Open sidebar</span>
			<Bars3 class="h-6 w-6" aria-hidden="true" />
		</button>
		<div class="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
		<a href="#">
			<span class="sr-only">Your profile</span>
			<img
				class="h-8 w-8 rounded-full bg-gray-50"
				src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
		</a>
	</div>

	<main class="lg:pl-72 h-[100vh]">
		<div class="h-full">
			<slot />
		</div>
	</main>

	<CreateTable form={$page.data.form} />
</div>
