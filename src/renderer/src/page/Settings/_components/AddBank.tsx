import { useEffect, useState } from 'react'
import { Notification } from '@renderer/components/notification'
import { useNotification } from '@renderer/context/notification.context'

export function AddBank() {
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()

  function handleNotification() {
    setContentNotification({
      ...contentNotification,
      title: 'Test Notification',
      message: 'Only a Test Notification!',
      type: 'info'
    })
    setShowNotification(true)
  }

  return (
    <>
      <h1>yh</h1>
      <button onClick={handleNotification}>Add Bank</button>
      
      <Notification />
    </>
  )
}
