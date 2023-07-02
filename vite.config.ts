import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import vitePluginRaw from 'vite-plugin-raw'
import checker from 'vite-plugin-checker'
import EnvironmentPlugin from 'vite-plugin-environment'
import { UserConfig, defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  return {
    resolve: {
      alias: [{ find: '@', replacement: '/src' }],
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    plugins: [
      react(), ssr(),
      checker({
        typescript: true,
      }),
      EnvironmentPlugin('all', { prefix: 'VITE_' }),
      vitePluginRaw({
        match: /\.mustache$/,
      }),
    ],
    ssr: {
      noExternal: ["styled-components", "@emotion/*"],
    },
  }
})
