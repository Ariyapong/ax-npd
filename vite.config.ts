import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import vitePluginRaw from 'vite-plugin-raw'
import { UserConfig } from 'vite'

const config: UserConfig = {
  // resolve: {
  //   alias: [{ find: '@', replacement: '/' }],
  // },
  plugins: [
    react(), ssr(),
    vitePluginRaw({
      match: /\.mustache$/,
    }),
  ],
  ssr: {
    noExternal: ["styled-components", "@emotion/*"],
  },
}

export default config
