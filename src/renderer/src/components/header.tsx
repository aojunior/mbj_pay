import electronLogo from '../assets/logo.png'

export function Header() {

    return (
        <div className="header">
            <img alt="logo" className="logo" src={electronLogo} />
        </div>
    )
}