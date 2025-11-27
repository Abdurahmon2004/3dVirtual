import React from 'react'
import StoreProvider from './Providers/StoreProvider'
import { RouterProvider } from 'react-router'
import AppRoutes from './routes'
import "./App.css"
export default function App() {
    return (
        <>
            <React.StrictMode >
                <StoreProvider >
                    <RouterProvider router={AppRoutes} />
                </StoreProvider>
            </React.StrictMode>
        </>
    )
}
