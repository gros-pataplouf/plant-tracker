// ./tests/setup.ts
import '@testing-library/jest-dom/vitest' //extends Vitest's expect method with methods from react-testing-library
import 'vitest-canvas-mock'
import { setupServer } from 'msw/node'
import { HttpResponse, http, passthrough } from 'msw'
import { baseURL } from '../src/constants/index'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import plants from './data/plants.json'
import locations from './data/locations.json'
import plantImages from './data/plantImages.json'

export const restHandlers = [
  http.get('http://localhost:8000/api/plants', () => {
    return HttpResponse.json(plants)})
  ,
  http.get(`http://localhost:8000/api/plants/images`, () => {
    return HttpResponse.json(plantImages)
  })
]

export const server = setupServer(...restHandlers)
beforeAll(() => {
  server.listen()
  // mock window.alert if called
  vi.spyOn(window, 'alert').mockImplementation(() => {})

  //mock the elements needed by embla carousel : https://github.com/davidjerleke/embla-carousel/discussions/775
  // match media
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
  // mock IntersectionObserver
  class IntersectionObserver {
    observe = vi.fn()
    disconnect = vi.fn()
    unobserve = vi.fn()
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
  })

  // mock ResizeObserver
  class ResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: ResizeObserver,
  })
  
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => server.close())


