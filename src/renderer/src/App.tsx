import electronLogo from './assets/logo.png'
import Home from './page/Home'

function App(): JSX.Element {
  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <Home/>

      {/* <div className="creator">Powered by electron-vite</div>

      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p> */}

    </>
  )
}

export default App
