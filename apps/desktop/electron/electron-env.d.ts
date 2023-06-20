/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    DIST: string
    DIST_ELECTRON: string
    /** /dist/ or /public/ */
    PUBLIC: string
    APP_ENV: 'desktop'

    UNDB_FRONTEND_OUT_DIR: string
    UNDB_DATABASE_SQLITE_DATA: string
    UNDB_BACKEND_PORT: number
  }
}
