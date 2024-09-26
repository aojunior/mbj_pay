import { Route, Routes, useNavigate } from 'react-router-dom'

import { Finalization } from '@renderer/page/Account/_components/finalization'
import { TermsOfUse } from '@renderer/page/Account/_components/termOfUse'

export default function AccountRouter(): JSX.Element {
    return (
      <Routes>
        <Route path="/" element={<TermsOfUse />} />
        {/* <Route path="/account/company" element={<FormCompany companyData={companyData} setCompanyData={setCompanyData}/>} />
        <Route path="/account/owner" element={<FormOwner ownerData={ownerData} setOwnerData={setOwnerData}/>} />
        <Route path="/account/bank" element={<FormBank bankData={bankData} setBankData={setBankData}/>} /> */}
        <Route  path="/finalization" element={<Finalization />} />
      </Routes>
    )
  }
