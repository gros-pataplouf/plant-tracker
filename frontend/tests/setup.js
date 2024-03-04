// ./tests/setup.ts
import '@testing-library/jest-dom/vitest'; //extends Vitest's expect method with methods from react-testing-library
import 'vitest-canvas-mock'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
import { baseURL } from '../src/constants/index'

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import plants from './data/plants.json'
import locations from './data/locations.json'
import plantsImages from './data/plants.json'

export const restHandlers = [
  http.get(`${baseURL}/api/plants`), () => {
    return HttpResponse.json(plants)
  },
  http.get(`${baseURL}/api/plants/images`), () => {
    return HttpResponse.json(plantsImages)
  },
  http.get(`${baseURL}/api/locations`), () => {
    return HttpResponse.json(locations)
  }
]

const server = setupServer(...restHandlers)

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
  server.resetHandlers()
});