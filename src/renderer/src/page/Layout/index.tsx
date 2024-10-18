import { Outlet } from 'react-router-dom'
import { Navbar } from '@renderer/components/navbar'
import { Header } from '@renderer/components/header'
import { ShowPassword } from '@renderer/components/password'

export function AppLayout() {

  return (
    <div
      style={{
        width: '100vw',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0
      }}
    >
      <Navbar />
      <Header />
      <Outlet />
      <ShowPassword />
    </div>
  )
}