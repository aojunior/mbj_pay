import { Notification } from '@renderer/components/notification'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@renderer/components/navbar'
import { Header } from '@renderer/components/header'

// export default function Layout() {
//   const { contentNotification, setContentNotification, setShowNotification } = useNotification()
//   const { accState, setAccState } = useAccount()
//   // const [showNotification, setShowNotification] = useState(false)
//   const [isLoad, setIsLoad] = useState<boolean>(false)
//   const navigate = useNavigate()

//   //Refresh Token in 5 minutes and storage in SessionStorage
//   const refreshAndStorageToken = useCallback(async () => {
//     const newToken = await win.api.tokenGenerator()
//     if (newToken == undefined || newToken == null) {
//       setContentNotification({
//         ...contentNotification,
//         type: 'error',
//         title: 'Error Connecting to server',
//         message: 'Error when trying to connect to the server'
//       })
//       setShowNotification(true)
//       throw new Error(`Access token not available`)
//     }
//     sessionStorage.setItem('token', newToken)
//   }, [])

//   useEffect(() => {
//     refreshAndStorageToken()
//     setInterval(() => refreshAndStorageToken(), 5000 * 60) // 5 min
//   }, [refreshAndStorageToken])

//   useEffect(() => {
//     const checkClient = async () => {
//       setIsLoad(true)
//       const exists = await win.api.getAccount()
//       if (exists) {
//         setAccState(exists)
//         navigate('/home')
//       } else {
//         setAccState(null)
//         navigate('/account/signin')
//       }
//       setIsLoad(false)
//     }
//     checkClient()
//   }, [])

//   return (
//     <div
//       style={{
//         width: '100vw',
//         alignItems: 'center',
//         display: 'flex',
//         flexDirection: 'column',
//         margin: 0,
//         padding: 0
//       }}
//     >
//       {isLoad && <Loading />}
//       {accState && <Navbar />}
//       <Header />
//       <Outlet />
//       <Notification />
//     </div>
//   )
// }


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
      {<Navbar />}
      <Header />
      <Outlet />
      <Notification />
    </div>
  )
}