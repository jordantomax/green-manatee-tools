import React, { createContext, useContext, useState } from 'react'
import { Notification } from '@mantine/core'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null)

    const showNotification = (type, message, metadata) => {
        setNotification({ message, type, metadata })
    }

    const clearNotification = () => {
        setNotification(null)
    }

    const typeConfig = {
        error: { color: 'red', title: 'Error' },
        warning: { color: 'yellow', title: 'Warning' },
        info: { color: 'blue', title: 'Info' },
        success: { color: 'green', title: 'Success' }
    }
    const config = typeConfig[notification?.type] || typeConfig.info
    const { color, title } = config

    return (
        <NotificationContext.Provider value={{ showNotification, clearNotification }}>
            {children}
            {notification && (
                <Notification
                    color={color}
                    title={title}
                    onClose={clearNotification}
                    style={{
                        position: 'fixed',
                        top: 20,
                        right: 20,
                        zIndex: 1000
                    }}
                >
                    {notification.message}

                    {notification.metadata?.length > 0 && notification.metadata.map((item, index) => {
                        if (!item.label) return null
                        return (
                            <div key={index} style={{ marginTop: 8, fontSize: '0.9em', color: 'var(--mantine-color-gray-6)' }}>
                                {item.label}: {item.value}
                            </div>
                        )
                    })}
                </Notification>
            )}
        </NotificationContext.Provider>
    )
}

export function useNotification() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
} 