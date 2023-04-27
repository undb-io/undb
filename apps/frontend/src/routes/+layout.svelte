<script>
	import '../app.postcss'
	import '@tabler/icons-webfont/tabler-icons.min.css'
	import NProgress from 'nprogress'
	import { navigating, getStores } from '$app/stores'

	import 'nprogress/nprogress.css'

	NProgress.configure({
		minimum: 0.16,
	})

	const { page } = getStores()

	$: {
		const r = $page.url.searchParams.get('r')
		// TODO: 判断前后是否一致
		if (!r) {
			if ($navigating && $navigating.from?.route.id !== $navigating.to?.route.id) {
				NProgress.start()
			}
		}
		if (!$navigating) {
			NProgress.done()
		}
	}
</script>

<slot />

<svelte:head>
	<title>undb</title>
</svelte:head>

<svelte:window on:beforeunload={null} />

<style>
	:global(#nprogress) {
		position: relative;
		z-index: 9999999;
	}
</style>
