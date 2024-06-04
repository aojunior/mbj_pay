import { Container, link } from "./style";
import { useNavigate } from 'react-router-dom'

// const navigate = (route: string) => {
//     (window as any).api.navigate(route);
// };

export function Navbar() {
    const navigate = useNavigate()

    return (
        <Container>
            <ul style={{display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'center'}}>
                <li><button style={link} onClick={() => navigate('/')}>Home</button></li>
                <li><button style={link} onClick={() => navigate('/dashboard')}>Dashboard</button></li>
                <li><button style={link} onClick={() => navigate('/createaccount')}>New Account</button></li>
                <li><button style={link} onClick={() => navigate('/settings')}>Settings</button></li>
            </ul>
        </Container>
    )
}