import { useEffect, useState } from 'react'
import { MdBusiness, MdPerson, MdMonitor, MdInfo } from 'react-icons/md'
import { FiCheckCircle } from 'react-icons/fi'
import { ProgressHeader, ProgressBar, ProgressBarFill } from '../styles'
import { styled } from 'styled-components'
import { useLocation } from 'react-router-dom'

export function Progress() {
  const location = useLocation()
  const [fillProgress, setFillProgress] = useState('0%')
  location.pathname

  useEffect(() => {
    switch(location.pathname) {
      case '/account/terms':
        setFillProgress('5%')
        break
      case '/account/company':
        setFillProgress('25%')
        break
      case '/account/owner':
        setFillProgress('50%')
        break
      case '/account/bank':
        setFillProgress('75%')
        break
      case '/account/complete':
        setFillProgress('100%')
        break
    }
  }, [location.pathname])

  return (
    <ProgressHeader >
      <ProgressBar>
        <ProgressBarFill style={{ width: fillProgress, display: 'flex', alignItems: 'center' }}>
          <Div
            style={{
              left: fillProgress == '100%'? '96%' : '100%'
            }}
          >

          { 
            location.pathname == '/account/terms' ? (
              <MdInfo size={24} color="#fff" />
            ) : location.pathname == '/account/company' ? (
              <MdBusiness size={24} color="#fff" />
            ) : location.pathname == '/account/owner' ? (
              <MdPerson size={24} color="#fff" />
            ) : location.pathname == '/account/bank' ? (
              <MdMonitor size={24} color="#fff" />
            ) : (
              <FiCheckCircle size={24} color="#fff" />
            )
          }
          </Div>
        </ProgressBarFill>
      </ProgressBar>
    </ProgressHeader>
  )
}

const Div = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #3178c6;
`
