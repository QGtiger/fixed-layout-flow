/// <reference types="vite/client" />

declare interface Window {
  __MICRO_APP_NAME__: string
  __MICRO_APP_ENVIRONMENT__: boolean
  microApp: any
  YD: {
    ENV?: string
    API_URL: string
    HOME_URL?: string
    CONSOLE_URL?: string
    BOSS_API_URL?: string
    REQUIREMENTS_URL?: string
    SSO_URL?: string
    __PROJECT_APP_BASE_ROUTE__: string
  }
}
