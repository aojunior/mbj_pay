import { createContext, useContext, useState } from 'react'

type notificationContentProps = {
    title: string,
    message: string,
    icon?: any
    type: 'error' | 'warning' | 'info' | 'confirm' | 'custom'
}

type notificationProps = {
    contentNotification: notificationContentProps
    setContentNotification: (a: notificationContentProps) => void
    showNotification: boolean
    setShowNotification: (a: boolean) => void
}

const NotificationContext = createContext<notificationProps>({} as notificationProps)
let win: any = window

export const NotificationWrapper = ({ children }) => {
    const [contentNotification, setContentNotification] = useState({} as notificationContentProps)
    const [showNotification, setShowNotification] = useState(false)

    return (
        <NotificationContext.Provider value={{ contentNotification, setContentNotification, showNotification, setShowNotification }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => useContext(NotificationContext)
