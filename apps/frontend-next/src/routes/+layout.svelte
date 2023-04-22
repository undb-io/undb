<script>
	import '../app.postcss'
	import NProgress from 'nprogress'
	import { navigating } from '$app/stores'

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

<style>
	:global(#nprogress) {
		position: relative;
		z-index: 9999999;
	}
</style>
