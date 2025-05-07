import React, { createContext, useContext, useState } from 'react'
import { Notification } from '@mantine/core'

const ErrorContext = createContext()

export function ErrorProvider({ children }) {
    const [error, setError] = useState(null)

    const showError = (error) => {
        setError(error)
    }

    const clearError = () => {
        setError(null)
    }

    return (
        <ErrorContext.Provider value={{ showError, clearError }}>
            {children}
            {error && (
                <Notification
                    color="red"
                    title="Error"
                    onClose={clearError}
                    style={{
                        position: 'fixed',
                        top: 20,
                        right: 20,
                        zIndex: 1000
                    }}
                >
                    {error.message}
                    {error.status && (
                        <div style={{ marginTop: 8, fontSize: '0.9em', color: 'var(--mantine-color-gray-6)' }}>
                            Status: {error.status}
                        </div>
                    )}
                    {error.data && (
                        <div style={{ marginTop: 8, fontSize: '0.9em', color: 'var(--mantine-color-gray-6)' }}>
                            {JSON.stringify(error.data)}
                        </div>
                    )}
                </Notification>
            )}
        </ErrorContext.Provider>
    )
}

export function useError() {
    const context = useContext(ErrorContext)
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider')
    }
    return context
} 