import { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { MdError } from 'react-icons/md'
import { CiWarning } from 'react-icons/ci'
import { MdOutlineInfo } from 'react-icons/md'
import { GiConfirmed } from 'react-icons/gi'
import { useNotification } from '@renderer/context/notification.context'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`
const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-5px);
  }
`
const NotificationContainer = styled.div<{ show: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  background-color: #fff; /* #1d4ed8; bg-primary */
  color: #f3f4f6; /* text-primary-foreground */
  border-radius: 8px;
  border: 1px solid #444;
  padding: 16px 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${({ show }) => (show ? fadeIn : fadeOut)} 0.5s forwards;
  transition: all 0.5s ease-in-out;
  z-index: 999999;
`
const NotificationContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`
const NotificationTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 500;
  color: #333;
`
const NotificationText = styled.p`
  font-size: 0.875rem;
  color: #575f6a; /* text-muted-foreground */
`
const CloseButton = styled.button`
  background: none;
  border: none;
  color: #444;
  font-size: 24px;
  margin-left: 15px;
  cursor: pointer;

  &:hover {
    color: #ddd;
  }
`

const Notification = () => {
  const { contentNotification, setShowNotification, showNotification, setContentNotification } = useNotification()
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false)
      setContentNotification({
        title: '',
        message: '',
        type: 'custom'
      })
    }, contentNotification.time || 5000)
    return () => clearTimeout(timer)
  }, [showNotification])

  return showNotification && contentNotification.type === 'error' ? (
    <NotificationContainer show={showNotification} style={{ borderColor: 'red' }}>
      <NotificationContent>
        <MdError size={24} color="red" />
        <div>
          <NotificationTitle>{contentNotification.title}</NotificationTitle>
          <NotificationText>{contentNotification.message}</NotificationText>
        </div>
      </NotificationContent>
      <CloseButton onClick={() => setShowNotification(false)}>×</CloseButton>
    </NotificationContainer>
  ) : showNotification && contentNotification.type === 'warning' ? (
    <NotificationContainer show={showNotification} style={{ borderColor: '#ffc241' }}>
      <NotificationContent>
        <CiWarning color="#ffc241" size={24} />
        <div>
          <NotificationTitle>{contentNotification.title}</NotificationTitle>
          <NotificationText>{contentNotification.message}</NotificationText>
        </div>
      </NotificationContent>
      <CloseButton onClick={() => setShowNotification(false)}>×</CloseButton>
    </NotificationContainer>
  ) : showNotification && contentNotification.type === 'info' ? (
    <NotificationContainer show={showNotification} style={{ borderColor: '#106bb9' }}>
      <NotificationContent>
        <MdOutlineInfo color="#106bb9" size={24} />
        <div>
          <NotificationTitle>{contentNotification.title}</NotificationTitle>
          <NotificationText>{contentNotification.message}</NotificationText>
        </div>
      </NotificationContent>
      <CloseButton onClick={() => setShowNotification(false)}>×</CloseButton>
    </NotificationContainer>
  ) : showNotification && contentNotification.type === 'success' ? (
    <NotificationContainer show={showNotification} style={{ borderColor: '#1a692d' }}>
      <NotificationContent>
        <GiConfirmed color="#1a692d" size={24} />
        <div>
          <NotificationTitle>{contentNotification.title}</NotificationTitle>
          <NotificationText>{contentNotification.message}</NotificationText>
        </div>
      </NotificationContent>
      <CloseButton onClick={() => setShowNotification(false)}>×</CloseButton>
    </NotificationContainer>
  ) : (
    showNotification && 
    contentNotification.type === 'custom' && contentNotification.message && (
      <NotificationContainer show={showNotification}>
        <NotificationContent>
          {contentNotification.icon}
          <div>
            <NotificationTitle>{contentNotification.title}</NotificationTitle>
            <NotificationText>{contentNotification.message}</NotificationText>
          </div>
        </NotificationContent>
        <CloseButton onClick={() => setShowNotification(false)}>×</CloseButton>
      </NotificationContainer>
    )
  )
}

export { Notification }
