/// <reference types="vite/client" />

declare module 'vite-plugin-raw'

declare module "*.mustache" {
    const value: string
    export default value
}

type Optional<T> = T | undefined | null;
