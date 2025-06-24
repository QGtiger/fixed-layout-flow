import createFetchClient from 'openapi-fetch'
import type { paths } from './api-types'
import { IApp } from '..'

export type { paths as API_TYPES } from './api-types'

const appFile = (import.meta as any).glob('../../App.tsx', {
  eager: true
})
const app: IApp = appFile[Object.keys(appFile)[0]]?.default

export const API = createFetchClient<paths>({
  baseUrl: window.YD.API_URL
})

API.use({
  onRequest: async ({ request }) => {
    const authorization = localStorage.getItem('ACCESS_TOKEN')
    request.headers.set('Authorization', `Bearer ${authorization}`)
    if (app?.apis?.beforeRequest) {
      return app.apis.beforeRequest(request)
    } else {
      return request
    }
  },
  onResponse: async ({ response }) => {
    if (app?.apis?.afterResponse) {
      return app.apis.afterResponse(response)
    } else {
      const data = await response.text()
      return new Response(data, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      })
    }
  }
})
