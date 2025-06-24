import { setupWorker } from 'msw/browser'
import { RequestHandler } from 'msw'

let handlers: RequestHandler[] = []

const mockFile = (import.meta as any).glob('../../mocks/index.ts', {
  eager: true
})
handlers = mockFile[Object.keys(mockFile)[0]]?.default || []

export const worker = setupWorker(...handlers)
