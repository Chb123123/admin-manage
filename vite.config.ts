import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import requireTransform from 'vite-plugin-require-transform';

export default defineConfig(({mode}) => {
	return {
		// base: env.VITE_PUBLIC_PATH,
		base: './',
		plugins: [
			vue(),
			VueSetupExtend(),
			AutoImport({
				resolvers: [ElementPlusResolver()]
			}),
			Components({
				resolvers: [ElementPlusResolver()]
			}),
			requireTransform({
				fileRegex: /.js$|.vue$/
			}),
		],
		optimizeDeps: {
			include: ['schart.js']
		},
		resolve: {
			alias: {
				'@': '/src',
				'~': '/src/assets'
			}
		},
		server: {
			proxy: {
				'api': {
					target: "http://127.0.0.1",
					changeOrigin: true,
					rewrite: path => path.replace(RegExp(`^api`), '')
				}
			}
		},
		define: {
			__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
		},
	}
});
