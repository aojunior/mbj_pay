import React from 'react';
import { MdBusiness, MdPerson, MdMonitor } from 'react-icons/md'
import { ProgressHeader, ProgressBar, ProgressBarFill } from '../styles';

export function Progress({data}: any) {
  const percent = ['20%', '50%', '100%']
  const icon = ['MdBusiness', 'MdPerson', 'MdMonitor']

  const Icon = () => {
    switch(data) {
      case 0:
        return <MdBusiness size={24} color='#fff'/>
      case 1:
        return <MdPerson size={24} color='#fff'/>
      case 2:
        return <MdMonitor size={24} color='#fff'/>
    }
  }

  const style = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#3178c6',
    left: data == 2 ? '96%' : '100%',
  }

  return (
    <ProgressHeader >
      <ProgressBar>
          <ProgressBarFill style={{width: percent[data], display: 'flex', alignItems: 'center'}}> 
            <div style={style} >
              <Icon />
            </div>
           </ProgressBarFill>
      </ProgressBar>
    </ProgressHeader>
  )
}

