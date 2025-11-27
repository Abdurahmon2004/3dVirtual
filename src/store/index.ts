import { configureStore } from '@reduxjs/toolkit'
import imagesSlice from './features/imagesSlice'
import ownerSlice from "./features/ownerSlice"
import companySlice from "./features/companySlice"
import roleSlice from "./features/roleSlice"
import objectSlice from "./features/objectSlice"
import blockSlice from "./features/blockSlice"
import planSlice from "./features/planSlice"
export const store = configureStore({
  reducer: {
    images: imagesSlice,
    owner: ownerSlice,
    company: companySlice,
    role: roleSlice,
    object: objectSlice,
    block: blockSlice,
    plan: planSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch