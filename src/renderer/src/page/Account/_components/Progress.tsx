import { MdBusiness, MdPerson, MdMonitor } from 'react-icons/md'
import { ProgressHeader, ProgressBar, ProgressBarFill } from '../styles'
import { styled } from 'styled-components'
export function Progress({ data }: any) {
  const percent = ['20%', '50%', '100%']

  return (
    <ProgressHeader>
      <ProgressBar>
        <ProgressBarFill style={{ width: percent[data], display: 'flex', alignItems: 'center' }}>
          <Div
            style={{
              left: data == 2 ? '96%' : '100%'
            }}
          >
            {data == 0 ? (
              <MdBusiness size={24} color="#fff" />
            ) : data == 1 ? (
              <MdPerson size={24} color="#fff" />
            ) : (
              <MdMonitor size={24} color="#fff" />
            )}
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
