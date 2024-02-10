import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'

export const listenerMiddleware = createListenerMiddleware();

export const startListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();
