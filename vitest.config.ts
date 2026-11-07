import { defineConfig } from 'vitest/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

// Tests don't need the TanStack Start/Nitro plugins from vite.config.ts,
// which try to boot a React SSR environment.
export default defineConfig({
  plugins: [viteTsConfigPaths({ projects: ['./tsconfig.json'] })],
})
