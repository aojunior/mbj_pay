import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { MdError } from 'react-icons/md'
import { CiWarning } from 'react-icons/ci'
import { MdOutlineInfo } from 'react-icons/md'
import { GiConfirmed } from 'react-icons/gi'

const slideIn = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`
const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

const NotificationWrapper = styled.div<{ isExiting: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  border: 1px solid #444;
  color: #444;
  padding: 15px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 10px;
  align-items: center;
  animation: ${({ isExiting }) => (isExiting ? fadeOut : slideIn)} 0.5s ease-out;
  opacity: ${({ isExiting }) => (isExiting ? 0 : 1)};
  transition: opacity 0.5s ease-out;

  z-index: 1000;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #444;
  font-size: 16px;
  margin-left: 15px;
  cursor: pointer;

  &:hover {
    color: #ddd;
  }
`

type NotificationProps = {
  icon?: any
  message: string
  show: boolean
  onClose: () => void
  type?: 'error' | 'warning' | 'info' | 'confirm' | 'custom'
}

const Notification = ({ message, icon, type, show, onClose }: NotificationProps) => {
  const [showNotification, setShowNotification] = useState(show)

  useEffect(():any => {
    if (show) {
      const timer = setTimeout(() => {
        setShowNotification(!showNotification)
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return show && type === 'error' ? (
    <NotificationWrapper isExiting={showNotification} style={{ borderColor: 'red' }}>
      <MdError size={24} color="red" />
      {message}
      <CloseButton onClick={() => onClose()}>×</CloseButton>
    </NotificationWrapper>
  ) : type === 'warning' ? (
    <NotificationWrapper isExiting={showNotification} style={{ borderColor: '#ffc241' }}>
      <CiWarning color="#ffc241" size={24} />
      {message}
      <CloseButton onClick={onClose}>×</CloseButton>
    </NotificationWrapper>
  ) : type === 'info' ? (
    <NotificationWrapper isExiting={showNotification} style={{ borderColor: '#106bb9' }}>
      <MdOutlineInfo color="#106bb9" size={24} />
      {message}
      <CloseButton onClick={onClose}>×</CloseButton>
    </NotificationWrapper>
  ) : type === 'confirm' ? (
    <NotificationWrapper isExiting={showNotification} style={{ borderColor: '#1a692d' }}>
      <GiConfirmed color="#1a692d" size={24} />
      {message}
      <CloseButton onClick={onClose}>×</CloseButton>
    </NotificationWrapper>
  ) : (
    type === 'custom' && (
      <NotificationWrapper isExiting={showNotification}>
        {icon}
        {message}
        <CloseButton onClick={onClose}>×</CloseButton>
      </NotificationWrapper>
    )
  )
}

export { Notification }
