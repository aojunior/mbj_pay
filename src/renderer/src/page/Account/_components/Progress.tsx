import { MdBusiness, MdPerson, MdMonitor } from 'react-icons/md';
import { ProgressHeader, ProgressBar, ProgressBarFill } from '../styles';


export function Progress({ data }: any) {
  const percent = ['20%', '50%', '100%'];
  
  return (
    <ProgressHeader>
      <ProgressBar>
        <ProgressBarFill style={{ width: percent[data], display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: '#3178c6', left: data == 2 ? '96%' : '100%' }}>
          {
            data == 0 ?
              <MdBusiness size={24} color='#fff' /> :
            data == 1 ?
              <MdPerson size={24} color='#fff' />
              :
              <MdMonitor size={24} color='#fff' />
          }
          </div>
        </ProgressBarFill>
      </ProgressBar>
    </ProgressHeader>
  );
}
