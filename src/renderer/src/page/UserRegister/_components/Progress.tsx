import React from 'react';

import { ProgressHeader, ProgressBar, ProgressBarFill } from '../styles';

export function Progress() {
  return (
    <ProgressHeader >
      <ProgressBar>
          <ProgressBarFill>  </ProgressBarFill>
      </ProgressBar>
    </ProgressHeader>
  )
}