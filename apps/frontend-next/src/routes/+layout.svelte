<script>
	import '../app.postcss'
	import '@tabler/icons-webfont/tabler-icons.min.css'
	import NProgress from 'nprogress'
	import { navigating, getStores } from '$app/stores'

	import 'nprogress/nprogress.css'

	NProgress.configure({
		minimum: 0.16,
	})

	$: {
		if ($navigating) {
			NProgress.start()
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
